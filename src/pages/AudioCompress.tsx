import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Download, 
  AudioLines, 
  FileAudio,
  Settings,
  Zap,
  Music,
  Play,
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioFile {
  file: File;
  id: string;
  originalSize: number;
  compressedSize?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export default function AudioCompress() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFiles: FileList) => {
    const audioFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('audio/')
    );

    if (audioFiles.length !== selectedFiles.length) {
      toast({
        title: "文件类型错误",
        description: "请选择音频文件（MP3、M4A等）",
        variant: "destructive"
      });
    }

    const newFiles: AudioFile[] = audioFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      originalSize: file.size,
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const compressFile = async (fileData: AudioFile) => {
    // 模拟压缩过程
    setFiles(prev => prev.map(f => 
      f.id === fileData.id 
        ? { ...f, status: 'processing' as const, progress: 0 }
        : f
    ));

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map(f => 
        f.id === fileData.id 
          ? { ...f, progress: i }
          : f
      ));
    }

    // 模拟压缩结果
    const compressedSize = Math.floor(fileData.originalSize * 0.7);
    setFiles(prev => prev.map(f => 
      f.id === fileData.id 
        ? { 
            ...f, 
            status: 'completed' as const, 
            progress: 100,
            compressedSize 
          }
        : f
    ));

    toast({
      title: "压缩完成",
      description: `${fileData.file.name} 压缩完成`,
    });
  };

  const compressAll = () => {
    files.filter(f => f.status === 'pending').forEach(file => {
      compressFile(file);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed?: number): string => {
    if (!compressed) return '-';
    const ratio = ((original - compressed) / original * 100).toFixed(1);
    return `${ratio}%`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">音频压缩工具</h1>
        <p className="text-muted-foreground">
          高效压缩MP3、M4A等音频文件，减小文件大小同时保持音质
        </p>
      </div>

      {/* Upload Area */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-all duration-300 bg-gradient-card",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">上传音频文件</h3>
          <p className="text-muted-foreground mb-4">
            拖拽文件到此处，或点击选择文件
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Badge variant="secondary">MP3</Badge>
            <Badge variant="secondary">M4A</Badge>
            <Badge variant="secondary">WAV</Badge>
            <Badge variant="secondary">FLAC</Badge>
          </div>
          <Button asChild className="bg-gradient-primary hover:bg-primary-hover">
            <label htmlFor="file-upload" className="cursor-pointer">
              <AudioLines className="w-4 h-4 mr-2" />
              选择文件
            </label>
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="audio/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>文件列表</CardTitle>
              <Button 
                onClick={compressAll}
                disabled={!files.some(f => f.status === 'pending')}
                className="bg-gradient-primary hover:bg-primary-hover"
              >
                <Zap className="w-4 h-4 mr-2" />
                全部压缩
              </Button>
            </div>
            <CardDescription>
              共 {files.length} 个文件，
              {files.filter(f => f.status === 'completed').length} 个已完成
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((fileData) => (
                <div 
                  key={fileData.id}
                  className="flex items-center gap-4 p-4 bg-background rounded-lg border"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileAudio className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{fileData.file.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>原始: {formatFileSize(fileData.originalSize)}</span>
                      {fileData.compressedSize && (
                        <>
                          <span>压缩后: {formatFileSize(fileData.compressedSize)}</span>
                          <Badge variant="outline" className="text-green-600">
                            节省 {getCompressionRatio(fileData.originalSize, fileData.compressedSize)}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    {fileData.status === 'processing' && (
                      <div className="mt-2">
                        <Progress value={fileData.progress} className="w-full" />
                        <span className="text-xs text-muted-foreground">
                          压缩中... {fileData.progress}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {fileData.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => compressFile(fileData)}
                        className="bg-gradient-primary hover:bg-primary-hover"
                      >
                        压缩
                      </Button>
                    )}
                    
                    {fileData.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeFile(fileData.id)}
                    >
                      移除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card className="border-0 bg-background shadow-soft">
        <CardHeader>
          <CardTitle>功能特点</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">保持音质</h4>
                <p className="text-sm text-muted-foreground">智能压缩算法，最大程度保持音频质量</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">批量处理</h4>
                <p className="text-sm text-muted-foreground">支持同时压缩多个音频文件</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">格式支持</h4>
                <p className="text-sm text-muted-foreground">支持MP3、M4A、WAV等主流格式</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}