
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-xl">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Search workflows..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 w-full h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white focus:text-black transition-all duration-300"
      />
    </div>
  );
};

export default SearchBar;
