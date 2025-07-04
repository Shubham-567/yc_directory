import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupCardType } from "@/components/StartupCard";

export const experimental_ppr = true;

const startup = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // Parallel Fetching:-
  const [post, { select: editorPosts }] = await Promise.all([
    await client.fetch(STARTUP_BY_ID_QUERY, {
      id,
    }),

    await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-picks",
    }),
  ]);

  if (!post) return notFound();

  const parsedContent = await marked(post?.pitch || "");

  return (
    <>
      <section className='heading_container !min-h-[230px]'>
        <p className='tag'>{formatDate(post?._createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
        <p className='sub-heading !max-w-5xl max-sm:!text-start'>
          {post?.description}
        </p>
      </section>

      <section className='section_container'>
        <Image
          src={post?.image || "https://placehold.co/800x450"}
          alt='thumbnail'
          className='rounded-xl w-full h-auto'
          width={800}
          height={450}
        />

        <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
          <div className='flex justify-between items-start xs:items-center max-xs:flex-col gap-2 xs:gap-5'>
            <Link
              href={`/user/${post.author?._id}`}
              className='flex gap-2 items-center mb-3'>
              <Image
                src={
                  post.author.image ||
                  "https://pascale.com.au/wp-content/uploads/2022/04/avatar-placeholder-300x300-1.gif"
                }
                alt='avatar'
                height={64}
                width={64}
                className='rounded-full drop-shadow-lg'
              />

              <div>
                <p className='text-20-medium'>{post.author.name}</p>
                <p className='text-16-medium !text-black-300'>
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className='category-tag'>{post.category}</p>
          </div>

          <h3 className='text-30-bold'>Pitch Details</h3>

          {parsedContent ? (
            <article
              className='prose max-w-4xl font-work-sans break-all'
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className='no-result'>No Details Provided.</p>
          )}
        </div>

        <hr className='divider' />

        {editorPosts?.length > 0 && (
          <div className='max-w-4xl mx-auto'>
            <p className='text-30-bold'>Editor Picks</p>

            <ul className='mt-7 card_grid-sm'>
              {editorPosts.map((post: StartupCardType, index: number) => (
                <StartupCard post={post} key={index} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className='view_skeleton' />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default startup;
