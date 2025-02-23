
import { Button } from "@/components/ui/button";
import { categories } from "@/data/tools";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-6">Categories</h2>
      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <Button
              key={category.name}
              variant={isSelected ? "default" : "ghost"}
              className={`w-full justify-start text-base font-medium transition-all duration-300 ${
                isSelected ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => onSelectCategory(category.name === selectedCategory ? null : category.name)}
            >
              <Icon className={`mr-2 h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
