import PasswordField from "@/common/passwordField";
import { ASSETS } from "@/helpers/assets";
import { Button, TextField } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";

// Define login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormDataLocal = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();

  // Initialize React Hook Form with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormDataLocal>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormDataLocal) => {
    // Store mock token to simulate login
    localStorage.setItem("accessToken", "mock-token");
    localStorage.setItem("refreshToken", "mock-refresh-token");
    
    console.log("Login data:", data);
    toast.success("Login successful!");
    navigate("/");
  };

  return (
      <div className="w-full max-w-[2000px] flex flex-col gap-2 justify-center items-center shadow-lg rounded-xl p-8 bg-white">
        <div className="flex justify-center mb-8">
          <img
            src={ASSETS.logo}
            alt="logo"
            width={120}
            height={120}
            style={{ objectFit: "contain", backgroundColor: "transparent" }}
            className=""
          />
        </div>
        <p className="text-text-primary text-3xl font-bold mb-2 text-center">Login To Your Account</p>
        <p className="text-gray-500 text-center mb-6">Enter your credentials to access the admin dashboard.</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                placeholder="Enter your email address"
                className="w-full"
                error={!!errors.email}
                helperText={errors.email?.message}
                size="medium"
                fullWidth
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordField
                {...field}
                label="Password"
                placeholder="Enter your password"
                className="w-full"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full h-14 mt-2"
          >
            <span className="text-white text-lg">
              { "Login"}
            </span>
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Forgot your password? </span>
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">Reset it</Link>
        </div>
      </div>
  );
};

export default LoginPage;
