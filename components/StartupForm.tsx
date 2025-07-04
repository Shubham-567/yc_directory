"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import { FormState } from "sanity";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pitch, setPitch] = useState("");

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
  });

  const router = useRouter();

  const handleFormSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      const formValuesToValidate = {
        ...formValues,
        pitch,
      };

      await formSchema.parseAsync(formValuesToValidate);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status == "SUCCESS") {
        toast.success("Success", {
          description: "Your startup pitch has been created successfully",
        });

        // clear form
        setFormValues({ title: "", description: "", category: "", link: "" });
        setPitch("");

        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast.error("Please check your inputs and try again");

        return { ...prevState, error: "Validation Failed", status: "ERROR" };
      }

      toast.error("An Unexpected error has occurred");

      return {
        ...prevState,
        error: "An Unexpected error has occurred.",
        status: "ERROR",
      };
    }
  };

  const [, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className='startup-form'>
      <div>
        <label htmlFor='title' className='startup-form_label'>
          Title
        </label>

        <Input
          id='title'
          name='title'
          value={formValues.title}
          onChange={(e) =>
            setFormValues({ ...formValues, title: e.target.value })
          }
          className='startup-form_input'
          required
          placeholder='Startup Title'
        />

        {errors.title && <p className='startup-form_error'>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor='description' className='startup-form_label'>
          Description
        </label>

        <Textarea
          id='description'
          name='description'
          value={formValues.description}
          onChange={(e) =>
            setFormValues({ ...formValues, description: e.target.value })
          }
          className='startup-form_textarea'
          required
          placeholder='Startup Description'
        />

        {errors.description && (
          <p className='startup-form_error'>{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor='category' className='startup-form_label'>
          Category
        </label>

        <Input
          id='category'
          name='category'
          value={formValues.category}
          onChange={(e) =>
            setFormValues({ ...formValues, category: e.target.value })
          }
          className='startup-form_input'
          required
          placeholder='Startup Category (Tech, Health, Education...)'
        />

        {errors.category && (
          <p className='startup-form_error'>{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor='link' className='startup-form_label'>
          Image Url
        </label>

        <Input
          id='link'
          name='link'
          value={formValues.link}
          onChange={(e) =>
            setFormValues({ ...formValues, link: e.target.value })
          }
          className='startup-form_input'
          required
          placeholder='Startup Image Url'
        />

        {errors.link && <p className='startup-form_error'>{errors.link}</p>}
      </div>

      <div data-color-mode='light'>
        <label htmlFor='pitch' className='startup-form_label'>
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id='pitch'
          preview='edit'
          height='300px'
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["styles"],
          }}
        />

        {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
      </div>

      <Button
        type='submit'
        className='startup-form_btn text-white'
        disabled={isPending}>
        {isPending ? "Submitting..." : "Submit your startup"}
        <Send className='size-6 ml-2' />
      </Button>
    </form>
  );
};

export default StartupForm;
