
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { workflows } from "@/data/tools";
import ReactMarkdown from "react-markdown";

const WorkflowProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const workflow = workflows.find(w => w.workflow_name === id);

  if (!workflow) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p>Workflow not found.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {workflow.icon_urls.map((icon, i) => (
              <Avatar 
                key={i} 
                className="w-12 h-12 border-2 border-white ring-2 ring-gray-100"
              >
                <AvatarImage src={icon} />
                <AvatarFallback>IC</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Badge variant={workflow.paid_or_free === "Free" ? "secondary" : "default"}>
            {workflow.paid_or_free}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold">{workflow.workflow_name}</h1>

        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={workflow.creator_avatar} />
            <AvatarFallback>{getInitials(workflow.creator_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{workflow.creator_name}</p>
            <p className="text-sm text-gray-500">{workflow.created_at}</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <ReactMarkdown>
            {workflow.workflow_description}
          </ReactMarkdown>
        </div>

        <Button 
          size="lg"
          onClick={() => window.open(workflow.workflow_url, "_blank")}
        >
          Get This Workflow
        </Button>
      </div>
    </div>
  );
};

export default WorkflowProfile;
