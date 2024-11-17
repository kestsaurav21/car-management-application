import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/../hooks/use-toast";
import { z } from "zod";

// Define the Zod schema for the login data
const loginSchema = z.object({
  userId: z
    .string()
    .min(3, { message: "User ID must be at least 3 characters long" }) // Ensure that userId is at least 3 characters
    .refine((val) => /\S+@\S+\.\S+/.test(val) || val.length >= 3, {
      message: "User ID must be a valid email or username",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

// Define the Zod schema for the signup data
const signUpSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChangeLogin = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUpChange = (e) => {
    setSignUpData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      // Validate the login data using Zod
      const result = loginSchema.safeParse(loginData);

      if (!result.success) {
        // If validation fails, show errors
        result.error.errors.forEach(() => {
          toast({
            title: "Validation Error"
          });
        });
        return; // Prevent the API request if validation fails
      }

      // If validation passes, proceed with the login API call
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND}/auth/user/login`,
        {
          method: "POST", // Correct HTTP method
          headers: {
            "Content-Type": "application/json", // Specify content type as JSON
          },
          body: JSON.stringify({
            userId: loginData.userId,
            password: loginData.password,
          }),
        }
      );

      if (!resp.ok) {
        const data = await resp.json();
        // If response is not OK, throw an error with the status text
        throw new Error(`Login failed: ${data.error}`);
      }

      const data = await resp.json();

      // Check if token is present in response data
      if (data?.token) {
        sessionStorage.setItem("token", data.token);
        navigate("/productList");
      } else {
        // Handle case where there is no token in the response
        throw new Error("Login failed: No token received");
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  const handleSignUp = async () => {
    try {
      // Validate the signup data using Zod
      const result = signUpSchema.safeParse(signUpData);

      if (!result.success) {
        // If validation fails, show errors
        result.error.errors.forEach((error) => {
          toast({
            title: "Validation Error"
          });
        });
        return; // Prevent the API request if validation fails
      }

      // If validation passes, proceed with the API call
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}/auth/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify content type as JSON
          },
          body: JSON.stringify({
            fullname: signUpData.fullname,
            email: signUpData.email,
            username: signUpData.username,
            password: signUpData.password,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        // If response is not OK, throw an error with the status text
        throw new Error(`Signup failed: ${data.error || "Unknown error"}`);
      }

      const data = await res.json();

      // Check if token is present in response data
      if (data?.token) {
        sessionStorage.setItem("token", data.token);
        navigate("/productList");
      } else {
        // Handle case where there is no token in the response
        throw new Error("Signup failed: No token received");
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/productList");
    }
  }, []);

  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Welcome to Car Management. Please login below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="userId">Username / Email</Label>
              <Input
                id="userId"
                placeholder="Username / Email"
                name="userId"
                value={loginData.userId}
                onChange={handleChangeLogin}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Password"
                type="Password"
                name="password"
                value={loginData.password}
                onChange={handleChangeLogin}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin}>Login In</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a user account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="Full Name"
                name="fullname"
                value={signUpData.fullname}
                onChange={handleSignUpChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                name="username"
                value={signUpData.username}
                onChange={handleSignUpChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                value={signUpData.password}
                onChange={handleSignUpChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSignUp}>Sign up</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
