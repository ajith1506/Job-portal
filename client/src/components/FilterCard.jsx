import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    Location: "",
    Industry: "",
    Salary: "",
  });
  const dispatch = useDispatch();

  const changeHandler = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  useEffect(() => {
    // Combine all selected filters into a single search query
    const query = Object.values(selectedFilters)
      .filter(Boolean) // Remove empty values
      .join(" ");
    dispatch(setSearchedQuery(query));
  }, [selectedFilters, dispatch]);

  return (
    <div className="w-full bg-white p-5 rounded-md shadow-md">
      <h1 className="font-bold text-lg mb-4">Filter Jobs</h1>
      {filterData.map((data, index) => (
        <div key={index} className="mb-5">
          <h2 className="font-bold text-md mb-2">{data.filterType}</h2>
          <RadioGroup
            value={selectedFilters[data.filterType] || ""}
            onValueChange={(value) => changeHandler(data.filterType, value)}
          >
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId} className="text-sm">
                    {item}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
