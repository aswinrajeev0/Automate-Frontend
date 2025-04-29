import React from "react";
import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group";
import { Label } from "../../../ui/Label";

interface CategoryFilterProps {
    filters: {
        category: string | undefined;
    };
    handleFilterChange: (key: string, value: string) => void;
}

const categories = [
    'All Categories',
    'Auto Repair',
    'Tire Service',
    'Engine Repair',
    'Quick Service',
    'Full Service',
    'Diagnostics',
    'Specialty Repair',
    'Premium Service',
    'Basic Service',
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ filters, handleFilterChange }) => {
    return (
        < div className="space-y-2" >
            <h3 className="font-medium">Category</h3>
            <RadioGroup
                value={filters.category}
                onValueChange={(value: any) => handleFilterChange('category', value)}
                className="flex flex-col gap-2"
            >
                {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                        <RadioGroupItem value={category} id={`category-${category}`} />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div >
    )
}

export default CategoryFilter