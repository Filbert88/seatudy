import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';

const FilterBar = () => {
  const [selectedRating, setSelectedRating] = useState('');

  const handleRatingChange = (event: any) => {
    setSelectedRating(event.target.value);
  };

  return (
    <nav className="h-fit w-[12rem] flex flex-col fixed left-5 top-[8rem]">
      <div className="flex border-secondary border-b w-full pb-3">
        <FiFilter className="text-secondary mx-2 text-2xl" />
        <div className="font-semibold text-2xl mx-2">Filters</div>
      </div>
      <div className="flex flex-col border-secondary border-b w-full px-2 py-3 items-start font-semibold">
        <div className="font-bold mb-1">Ratings</div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="rating"
            value="4"
            checked={selectedRating === '4'}
            onChange={handleRatingChange}
          />
          <FaStar color="#B4690E" />
          <FaStar color="#B4690E" />
          <FaStar color="#B4690E" />
          <FaStar color="#B4690E" />
          <FaRegStar color="#B4690E" />
          <div className="text-sm whitespace-nowrap ml-1">4 & up</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="rating"
            value="3"
            checked={selectedRating === '3'}
            onChange={handleRatingChange}
          />
          <FaStar color="#B4690E" />
          <FaStar color="#B4690E" />
          <FaStar color="#B4690E" />
          <FaRegStar color="#B4690E" />
          <FaRegStar color="#B4690E" />
          <div className="text-sm whitespace-nowrap ml-1">3 & up</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="rating"
            value="2"
            checked={selectedRating === '2'}
            onChange={handleRatingChange}
          />
          <FaStar color="#B4690E" />
          <FaStar color="#B4690E" />
          <FaRegStar color="#B4690E" />
          <FaRegStar color="#B4690E" />
          <FaRegStar color="#B4690E" />
          <div className="text-sm whitespace-nowrap ml-1">2 & up</div>
        </div>
      </div>
      <div className="flex flex-col border-secondary border-b w-full px-2 py-3 items-start font-semibold">
        <div className="font-bold mb-1">Difficulty</div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Beginner</div>
        </div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Intermediate</div>
        </div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Advanced</div>
        </div>
      </div>
      <div className="flex flex-col w-full px-2 py-3 items-start font-semibold">
        <div className="font-bold mb-1">Category</div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Web Development</div>
        </div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Data Science & ML</div>
        </div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Game Development</div>
        </div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Programming Language</div>
        </div>
        <div className="flex items-center mb-1">
          <input type="checkbox" className="bg-transparent mr-1" />
          <div className="text-sm whitespace-nowrap ml-1">Computer Network</div>
        </div>
      </div>
    </nav>
  );
};

export default FilterBar;
