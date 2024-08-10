import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import { RiCloseCircleLine } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";

interface FilterBarProps {
  route: string;
}

const FilterBar = ({ route }: FilterBarProps) => {
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const rating = searchParams.get('rating');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    if (rating) {
      setSelectedRating(rating);
      setIsFilterEnabled(true);
    }
    if (difficulty) {
      setSelectedDifficulty(difficulty);
      setIsFilterEnabled(true);
    }
    if (category) {
      setSelectedCategory(category);
      setIsFilterEnabled(true);
    }
  }, []);

  const buildQueryParams = (newRating?: string, newDifficulty?: string, newCategory?: string) => {
    const params = new URLSearchParams();
    const rating = newRating !== undefined ? newRating : selectedRating;
    const difficulty = newDifficulty !== undefined ? newDifficulty : selectedDifficulty;
    const category = newCategory !== undefined ? newCategory : selectedCategory;
    
    if (rating) {
      params.set('rating', rating);
    }
    if (difficulty) {
      params.set('difficulty', difficulty);
    }
    if (category) {
      params.set('category', category);
    }
    return params.toString();
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = event.target.value;
    setSelectedRating(newRating);
    setIsFilterEnabled(true);
    const queryParams = buildQueryParams(newRating);
    router.push(`/${route}?${queryParams}`);
  };

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDifficulty = event.target.value;
    setSelectedDifficulty(newDifficulty);
    setIsFilterEnabled(true);
    const queryParams = buildQueryParams(undefined, newDifficulty);
    router.push(`/${route}?${queryParams}`);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setIsFilterEnabled(true);
    const queryParams = buildQueryParams(undefined, undefined, newCategory);
    router.push(`/${route}?${queryParams}`);
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
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="difficulty"
            value="BEGINNER"
            checked={selectedDifficulty === 'BEGINNER'}
            onChange={handleDifficultyChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Beginner</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="difficulty"
            value="INTERMEDIATE"
            checked={selectedDifficulty === 'INTERMEDIATE'}
            onChange={handleDifficultyChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Intermediate</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="difficulty"
            value="ADVANCED"
            checked={selectedDifficulty === 'ADVANCED'}
            onChange={handleDifficultyChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Advanced</div>
        </div>
      </div>
      <div className="flex flex-col w-full px-2 py-3 items-start font-semibold">
        <div className="font-bold mb-1">Category</div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="category"
            value="Software"
            checked={selectedCategory === 'Software'}
            onChange={handleCategoryChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Software</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="category"
            value="Hardware"
            checked={selectedCategory === 'Hardware'}
            onChange={handleCategoryChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Hardware</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="category"
            value="Science"
            checked={selectedCategory === 'Science'}
            onChange={handleCategoryChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Science</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="category"
            value="Physics"
            checked={selectedCategory === 'Physics'}
            onChange={handleCategoryChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Physics</div>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            className="bg-transparent mr-1"
            name="category"
            value="Biology"
            checked={selectedCategory === 'Biology'}
            onChange={handleCategoryChange}
          />
          <div className="text-sm whitespace-nowrap ml-1">Biology</div>
        </div>
      </div>
      {isFilterEnabled && (
        <div className="flex">
          <div 
            onClick={() => {
              router.push(`/${route}`);
              setTimeout(() => window.location.reload(), 10);
            }} 
            className="hover:cursor-pointer flex items-center justify-center bg-transparent border border-secondary text-secondary text-sm w-fit h-fit px-3 py-1 rounded-full mr-2"
          >
            <RiCloseCircleLine className="text-md" />
            <div className="font-semibold ml-2">Reset</div>
          </div>
          <div 
            onClick={() => {
              window.location.reload();
            }} 
            className="hover:cursor-pointer flex items-center justify-center bg-secondary border border-secondary text-white text-sm w-fit h-fit px-3 py-1 rounded-full"
          >
            <FaRegCircleCheck className="text-md" />
            <div className="font-semibold ml-2">Apply</div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FilterBar;
