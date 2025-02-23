
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_categories")
        .select("category_url, id");

      if (error) throw error;

      return data.map(category => ({
        name: formatCategoryName(category.category_url),
        id: category.id,
        url: category.category_url
      }));
    }
  });

  // Helper function to format category name from URL slug
  const formatCategoryName = (categoryUrl: string) => {
    // Remove any file extension if present
    const baseName = categoryUrl.split('.')[0];
    // Split by common delimiters and clean up
    const words = baseName
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return words;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-6">Categories</h2>
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-6">Categories</h2>
      <div className="space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.url;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "ghost"}
              className={`w-full justify-start text-base font-medium transition-all duration-300 ${
                isSelected ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => onSelectCategory(category.url === selectedCategory ? null : category.url)}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;

