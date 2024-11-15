import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"

export function Home() {

  const [ loginData, setLoginData ] = useState({ 
    userId : "",
    password: ""
  });

  const [ signUpData, setSignUpData ] = useState({
    fullname: "",
    username : "",
    email : "",
    password: ""
  })



  const handleChangeLogin = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name] : e.target.value
    }));
  }

  const handleSignUpChange = (e) => {
    setSignUpData((prev) => ({
      ...prev,
      [e.target.name] : e.target.value
    }))
  }

  const handleLogin = async () => {
    const resp = await fetch("http://localhost:5005/api/auth/user/login", {
      method: "POST", // Correct HTTP method
      headers: {
        "Content-Type": "application/json" // Specify content type as JSON
      },
      body: JSON.stringify({ // Convert the body to a JSON string
        userId: loginData.userId,
        password: loginData.password
      })
    });
    
    const data = await resp.json()

    sessionStorage.setItem("token", data.token);
  }

  const handleSignUp = async () => {
    const res = await fetch("http://localhost:5005/api/auth/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ // Convert the body to a JSON string
        fullname: signUpData.fullname,
        email: signUpData.email,
        username: signUpData.username,
        password: signUpData.password
      }) 
    });

    const data = await res.json();

    sessionStorage.setItem("token", data.token);
    
  }

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
              <Input id="userId" placeholder="Username / Email" name="userId" value={loginData.userId} onChange={handleChangeLogin} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Password" type="Password" name="password" value={loginData.password} onChange={handleChangeLogin} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} >Login In</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create a user account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="fullname">Full Name</Label>
              <Input id="fullname" type="text" placeholder="Full Name" name="fullname" value={signUpData.fullname} onChange={handleSignUpChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Username" name="username" value={signUpData.username} onChange={handleSignUpChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" name="email" value={signUpData.email} onChange={handleSignUpChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" name="password" value={signUpData.password} onChange={handleSignUpChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSignUp}>Sign up</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
