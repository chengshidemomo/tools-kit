import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import JsonFormatter from "./pages/JsonFormatter";
import AudioCompress from "./pages/AudioCompress";
import StringEscape from "./pages/StringEscape";
import Base64 from "./pages/Base64";
import UrlEncode from "./pages/UrlEncode";
import SqlFormatter from "./pages/SqlFormatter";
import RandomString from "./pages/RandomString";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/audio-compress" element={<AudioCompress />} />
            <Route path="/string-escape" element={<StringEscape />} />
            <Route path="/base64" element={<Base64 />} />
            <Route path="/url-encode" element={<UrlEncode />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
