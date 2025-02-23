
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, ExternalLink } from "lucide-react";
import type { Workflow } from "@/data/tools";

interface ToolCardProps {
  workflow: Workflow;
}

const ToolCard = ({ workflow }: ToolCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {workflow.icon_urls.slice(0, 3).map((icon, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={icon} />
                  <AvatarFallback>IC</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Badge variant={workflow.paid_or_free === "Free" ? "secondary" : "default"}>
              {workflow.paid_or_free}
            </Badge>
          </div>

          <h3 className="font-semibold text-xl">{workflow.workflow_name}</h3>
          
          <p className="text-gray-600 line-clamp-3">
            {workflow.workflow_description}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={workflow.creator_avatar} />
                <AvatarFallback>{getInitials(workflow.creator_name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{workflow.creator_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="w-4 h-4" />
              {workflow.created_at}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => window.open(workflow.workflow_url, "_blank")}
        >
          View Workflow
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;
