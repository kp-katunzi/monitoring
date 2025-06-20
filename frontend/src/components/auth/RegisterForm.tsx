
// import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { useToast } from '../ui/use-toast';
// import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

// interface RegisterFormProps {
//   onSwitchToLogin: () => void;
// }

// export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     phone_number: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { register } = useAuth();
//   const { toast } = useToast();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       toast({
//         title: "Password mismatch",
//         description: "Passwords do not match",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const success = await register({
//         username: formData.username,
//         email: formData.email,
//         phone_number: formData.phone_number,
//         password: formData.password
//       });

//       if (success) {
//         toast({
//           title: "Registration successful",
//           description: "Welcome to Domain Monitor!",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Registration failed",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold">Create account</h1>
//         <p className="text-muted-foreground mt-2">Sign up to get started</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="username">Username</Label>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               id="username"
//               name="username"
//               type="text"
//               placeholder="Enter your username"
//               value={formData.username}
//               onChange={handleChange}
//               className="pl-10"
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               className="pl-10"
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="phone_number">Phone Number (Optional)</Label>
//           <div className="relative">
//             <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               id="phone_number"
//               name="phone_number"
//               type="tel"
//               placeholder="Enter your phone number"
//               value={formData.phone_number}
//               onChange={handleChange}
//               className="pl-10"
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="password">Password</Label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               id="password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               className="pl-10 pr-10"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2"
//             >
//               {showPassword ? (
//                 <EyeOff className="h-4 w-4 text-muted-foreground" />
//               ) : (
//                 <Eye className="h-4 w-4 text-muted-foreground" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="confirmPassword">Confirm Password</Label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               id="confirmPassword"
//               name="confirmPassword"
//               type="password"
//               placeholder="Confirm your password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="pl-10"
//               required
//             />
//           </div>
//         </div>

//         <Button type="submit" className="w-full" disabled={isLoading}>
//           {isLoading ? "Creating account..." : "Create account"}
//         </Button>
//       </form>

//       <div className="text-center">
//         <p className="text-sm text-muted-foreground">
//           Already have an account?{" "}
//           <button
//             onClick={onSwitchToLogin}
//             className="text-primary hover:underline font-medium"
//           >
//             Sign in
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };



import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        password: formData.password,
      });

      if (success) {
        toast({
          title: "Registration successful",
          description: "Welcome to Domain Monitor!",
        });

        // Optional: clear form or redirect
        setFormData({
          username: '',
          email: '',
          phone_number: '',
          password: '',
          confirmPassword: ''
        });
        onSwitchToLogin();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong. Please try again.";

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-muted-foreground mt-2">Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
