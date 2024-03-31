import React from "react";
import auth from "@/utils/firebase";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Button, Input } from "@/components";

interface FormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  /** Handles form submission */
  const onSubmit = async (data: FormInputs): Promise<void> => {
    await signInWithEmailAndPassword(data.email, data.password);
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  /** Firebase hooks */
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  // Show errors
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <Input
          label="Email address"
          placeholder="john.doe@company.com"
          error={errors.email?.message}
          {...register("email", {
            required: { value: true, message: "Required" },
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
              message: "Invalid email address",
            },
          })}
        />
      </div>
      <div className="mb-6">
        <Input
          label="Password"
          type="password"
          placeholder="•••••••••"
          error={errors.password?.message}
          {...register("password", {
            required: { value: true, message: "Required" },
          })}
        />
      </div>
      <Button type="submit">Log in</Button>
      <Link href="/auth/signup" passHref>
        <Button variant="secondary">Sign up</Button>
      </Link>
      <Link href="/auth/forgot-password" passHref>
        <Button variant="secondary">Forgot password</Button>
      </Link>
    </form>
  );
};

export default LoginForm;
