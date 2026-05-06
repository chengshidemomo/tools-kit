import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import Home from "./pages/Home";
import JsonFormatter from "./pages/JsonFormatter";
import StringEscape from "./pages/StringEscape";
import Base64 from "./pages/Base64";
import UrlEncode from "./pages/UrlEncode";
import SqlFormatter from "./pages/SqlFormatter";
import RandomString from "./pages/RandomString";
import DeviceToIp from "./pages/DeviceToIp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/string-escape" element={<StringEscape />} />
            <Route path="/base64" element={<Base64 />} />
            <Route path="/url-encode" element={<UrlEncode />} />
            <Route path="/sql-formatter" element={<SqlFormatter />} />
            <Route path="/random-string" element={<RandomString />} />
            <Route path="/device-to-ip" element={<DeviceToIp />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
