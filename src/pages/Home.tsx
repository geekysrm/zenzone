
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, Shield } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Welcome to <span className="text-primary">ChatFlow</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            The secure, real-time messaging platform designed for teams that need to stay connected.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
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
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Real-time Messaging</h3>
            <p className="text-slate-600">
              Communicate with your team instantly with our powerful real-time messaging system.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Team Channels</h3>
            <p className="text-slate-600">
              Organize conversations by topics with dedicated channels for your teams and projects.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Secure Communication</h3>
            <p className="text-slate-600">
              Your data is protected with enterprise-grade security and end-to-end encryption.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">ChatFlow</h3>
              <p className="text-slate-400 mt-2">© 2024 ChatFlow. All rights reserved.</p>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
