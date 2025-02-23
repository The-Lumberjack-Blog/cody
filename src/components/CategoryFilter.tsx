
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

      console.log("Raw category data:", data); // Debug log

      return data.map(category => {
        const formattedName = formatCategoryName(category.category_url);
        console.log("Category URL:", category.category_url, "Formatted name:", formattedName); // Debug log
        return {
          name: formattedName,
          id: category.id,
          url: category.category_url
        };
      });
    }
  });

  // Enhanced helper function to format category name from URL slug
  const formatCategoryName = (categoryUrl: string) => {
    console.log("Formatting category URL:", categoryUrl); // Debug log
    
    // Common word replacements for better readability
    const commonReplacements: Record<string, string> = {
      'ai': 'AI',
      'llm': 'LLM',
      'nlp': 'NLP',
      'ml': 'ML',
      'api': 'API',
      'apis': 'APIs',
      'cms': 'CMS',
      'seo': 'SEO',
      'ui': 'UI',
      'ux': 'UX',
      'pdf': 'PDF',
      'csv': 'CSV',
    };

    // Remove any file extension if present
    const baseName = categoryUrl.split('.')[0];
    
    // Split by common delimiters
    const words = baseName.split(/[-_]/);
    
    console.log("Split words:", words); // Debug log
    
    // Process each word
    const formattedWords = words.map(word => {
      const lowerWord = word.toLowerCase();
      
      // Check if it's a common technical term that should be in uppercase
      if (commonReplacements[lowerWord]) {
        return commonReplacements[lowerWord];
      }
      
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    const result = formattedWords.join(' ');
    console.log("Final formatted result:", result); // Debug log
    return result;
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

