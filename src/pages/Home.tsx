
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  Users,
  Shield,
  Zap,
  Globe,
  BellRing,
  CheckCircle2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary">ZenZone</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</a>
          </div>
          <div>
            {user ? (
              <Button 
                size="sm" 
                className="group"
                onClick={() => navigate("/chat")}
              >
                Go to Chat
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  className="group"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Modern communication for<br />
            <span className="bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">better teamwork</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-10">
            The secure, real-time messaging platform designed for teams that need to stay connected wherever they work.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <Button 
                size="lg" 
                className="group"
                onClick={() => navigate("/chat")}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="group"
                  onClick={() => navigate("/auth")}
                >
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/auth")}
                >
                  View Demo
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-${i * 100 + 200}`}></div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">10,000+</span> teams already joined
            </p>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <img 
              src="/screenshot.jpg" 
              alt="ZenZone Chat Application" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
      
      {/* Brands Section */}
      <section className="py-8 bg-gray-50 border-y">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-gray-500 mb-6">TRUSTED BY LEADING COMPANIES</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-75">
            {['Airbnb', 'Spotify', 'Amazon', 'Netflix', 'Uber', 'Dropbox'].map((brand, i) => (
              <div key={i} className="text-xl font-bold text-gray-400">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">FEATURES</p>
          <h2 className="text-3xl font-bold text-gray-900">Everything you need for seamless communication</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
            Comprehensive tools to help your team collaborate effectively.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-time Messaging</CardTitle>
              <CardDescription>
                Communicate with your team instantly with our powerful real-time messaging system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Instant message delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Message read receipts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Typing indicators</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Team Channels</CardTitle>
              <CardDescription>
                Organize conversations by topics with dedicated channels for your teams and projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Public and private channels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Channel management tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Thread-based discussions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure Communication</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security and end-to-end encryption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">End-to-end encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">GDPR compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Regular security audits</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BellRing className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Notifications</CardTitle>
              <CardDescription>
                Stay in the loop with customizable notifications for what matters most.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Customizable alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Do not disturb mode</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Mobile push notifications</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Global Accessibility</CardTitle>
              <CardDescription>
                Access your workspace from anywhere, on any device with our responsive platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Cross-platform compatibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Mobile apps for iOS and Android</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Offline support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with your favorite tools to streamline your workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">100+ app integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Custom webhook support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-2">TESTIMONIALS</p>
            <h2 className="text-3xl font-bold text-gray-900">What our customers are saying</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
              Thousands of teams trust ZenZone for their daily communication needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "ZenZone has transformed how our remote team collaborates. The interface is intuitive, and the real-time messaging is incredibly reliable.",
                author: "Sarah Johnson",
                role: "CTO at TechVision",
                avatar: 1
              },
              {
                quote: "We've tried many team communication tools, but none matched the simplicity and effectiveness of ZenZone. It's now essential to our workflow.",
                author: "Michael Chen",
                role: "Product Manager at Innovate Inc",
                avatar: 2
              },
              {
                quote: "The security features in ZenZone give us peace of mind when discussing sensitive projects. It's the perfect balance of usability and safety.",
                author: "Aisha Patel",
                role: "Security Director at SecureWorks",
                avatar: 3
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-slate-${(i+1) * 100 + 300} flex items-center justify-center text-white font-semibold`}>
                      {testimonial.author.split(' ').map(name => name[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600">"{testimonial.quote}"</div>
                  <div className="flex items-center mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">PRICING</p>
          <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
            No hidden fees, no surprises. Choose the plan that works for your team.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="ml-1 text-xl text-gray-500">/month</span>
              </div>
              <CardDescription className="mt-4">
                Perfect for small teams just getting started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Up to 10 team members</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>5 channels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>10K message history</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Basic integrations</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-sm font-semibold py-1 px-3 rounded-full">
              Popular
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">$12</span>
                <span className="ml-1 text-xl text-gray-500">/user/month</span>
              </div>
              <CardDescription className="mt-4">
                Everything you need for a growing team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited channels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited message history</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Advanced integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">$29</span>
                <span className="ml-1 text-xl text-gray-500">/user/month</span>
              </div>
              <CardDescription className="mt-4">
                Advanced security and control for large organizations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>SSO & SAML</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Data retention policies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>24/7 premium support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Custom contract</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => navigate("/auth")}
              >
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your team's communication?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of teams that use ZenZone to collaborate effectively.
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => navigate("/auth")}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
                <span className="font-bold text-xl">ZenZone</span>
              </div>
              <p className="text-gray-400 mb-6">
                The modern platform for team communication and collaboration.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ZenZone. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
