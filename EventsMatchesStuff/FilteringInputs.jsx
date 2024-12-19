import React from "react";
import { useState } from "react";
import styled from "styled-components";
import ReactSelect from "react-select";


const FilterInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 15px;
  background-color: ${(props) =>
    props.theme.colors.backgroundLight || "#f9f9f9"};
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  input {
    flex: 1;
    min-width: 200px;
    padding: 10px 15px;
    font-size: 1rem;
    border: 1px solid ${(props) => props.theme.colors.border || "#ddd"};
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: ${(props) => props.theme.colors.like || "lightseagreen"};
    }
  }
`;

const FilterInputsExport = ({ filters, setFilters }) => {
    const tagOptions = [
        { value: "Adrenalin", label: "Adrenalin" },
        { value: "Chill", label: "Chill" },
        { value: "Alcohol", label: "Alcohol" },
        { value: "Educational", label: "Educational" },
        { value: "Music", label: "Music" },
        { value: "Cultural", label: "Cultural" },
        { value: "Social", label: "Social" },
        { value: "Fitness", label: "Fitness" },
        { value: "Creative", label: "Creative" },
        { value: "Foodie", label: "Foodie" },
        { value: "Spiritual", label: "Spiritual" },
        { value: "Outdoor", label: "Outdoor" },
        { value: "Sports", label: "Sports" },
        { value: "Party", label: "Party" },
        { value: "Tech", label: "Tech" },
        { value: "Charity", label: "Charity" },
      ];
        const [tagsState, setTagsState] = useState({ optionSelected: null });
        /*const [filters, setFilters] = useState({
            name: "",
            tag: "",
            minPrice: "",
            maxPrice: "",
          });*/




    const handleFilterChange = (e) => {
        // This will store selected options, which are objects with 'value' and 'label'
        setTagsState({
          optionSelected: e,
        });
    
        // Handle other filters changes (e.g., name, minPrice, maxPrice)
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
      };

    return(
        <FilterInputs>
          <input
            type="text"
            placeholder="Filter by name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            />

          <ReactSelect
            options={tagOptions}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            onChange={(selected) => {
                setTagsState({ optionSelected: selected });
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    tag: selected.map((option) => option.value), // Update filters.tag to be an array of selected values
                }));
            }}
            value={tagsState.optionSelected}
            />
          <input
            type="number"
            placeholder="Min price"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            />
          <input
            type="number"
            placeholder="Max price"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            />
    </FilterInputs>
)
}
export default FilterInputsExport;