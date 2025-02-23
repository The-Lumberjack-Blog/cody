
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ToolCard from "@/components/ToolCard";
import { workflows, categories } from "@/data/tools";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch = workflow.workflow_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.workflow_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || workflow.category_url?.includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-2">Workflow Directory</h1>
      <p className="text-gray-600 mb-8">Discover and implement automated workflows for your business</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </aside>
        
        <main className="lg:col-span-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <div className="grid grid-cols-1 gap-6 mt-8">
            {filteredWorkflows.map((workflow) => (
              <ToolCard key={workflow.workflow_url} workflow={workflow} />
            ))}
          </div>
          
          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No workflows found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
