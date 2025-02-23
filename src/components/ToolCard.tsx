
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, ExternalLink, ChevronRight, Info } from "lucide-react";
import type { Workflow } from "@/data/tools";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <Card className="group p-6 hover:shadow-lg transition-all duration-300 bg-white border-transparent hover:border-black">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {workflow.icon_urls.slice(0, 3).map((icon, i) => (
                <Avatar 
                  key={i} 
                  className="w-10 h-10 border-2 border-white ring-2 ring-gray-100 transition-transform group-hover:translate-y-[-2px]"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <AvatarImage src={icon} />
                  <AvatarFallback>IC</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Badge 
              variant={workflow.paid_or_free === "Free" ? "secondary" : "default"}
              className="ml-2"
            >
              {workflow.paid_or_free}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-2xl mb-2 group-hover:text-black transition-colors">
              {workflow.workflow_name}
            </h3>
            <p className="text-gray-600 line-clamp-2 text-base leading-relaxed">
              {workflow.workflow_description}
            </p>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={workflow.creator_avatar} />
                <AvatarFallback>{getInitials(workflow.creator_name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600 font-medium">{workflow.creator_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="w-4 h-4" />
              {workflow.created_at}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center gap-4">
        <Button 
          variant="outline"
          className="group-hover:bg-black group-hover:text-white transition-all duration-300 border-gray-200"
          onClick={() => window.open(workflow.workflow_url, "_blank")}
        >
          Get Workflow
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost">
              More Details
              <Info className="w-4 h-4 ml-2" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>{workflow.workflow_name}</SheetTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={workflow.creator_avatar} />
                  <AvatarFallback>{getInitials(workflow.creator_name)}</AvatarFallback>
                </Avatar>
                <span>{workflow.creator_name}</span>
              </div>
            </SheetHeader>
            <div className="mt-6">
              <Badge variant={workflow.paid_or_free === "Free" ? "secondary" : "default"}>
                {workflow.paid_or_free}
              </Badge>
              <div className="mt-4 prose prose-gray">
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                  {workflow.workflow_description}
                </p>
              </div>
              <div className="mt-6">
                <Button 
                  className="w-full"
                  onClick={() => window.open(workflow.workflow_url, "_blank")}
                >
                  Get Workflow
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Card>
  );
};

export default ToolCard;

