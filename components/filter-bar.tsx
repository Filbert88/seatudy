import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { TbFilter } from "react-icons/tb";
import { RiCloseCircleLine } from "react-icons/ri";
import { CategoryInterface } from './types/types';
import { useToast } from './ui/use-toast';

interface FilterBarProps {
  route: string;
}

const FilterBar = ({ route }: FilterBarProps) => {
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryInterface[]>([]);
  const [title, setTitle] = useState<string>('')
  const searchParams = useSearchParams();

  const router = useRouter();
  const { toast } = useToast();

  const getCategoryData = async () => {
    try {
      const response = await fetch('/api/category', {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCategoryData(data.data);
        localStorage.setItem('category', JSON.stringify(data.data));
      } else {
        toast({
          title: 'Failed to load categories',
          variant: 'destructive',
        });
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const localStorageCategory = JSON.parse(localStorage.getItem("category") ?? '[]');
    setCategoryData(localStorageCategory);
    const rating = searchParams.get('rating');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('categoryId');
    const urlTitle = searchParams.get('title');
    console.log(urlTitle);
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
    if (urlTitle && urlTitle !== '') {
      setTitle(urlTitle);
    }
    else {
      setTitle('');
    }
    getCategoryData();
  }, [searchParams]);

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
      params.set('categoryId', category);
    }
    if (title !== '') {
      params.set('title', title);
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
    <nav className="h-fit w-[12rem] flex flex-col fixed left-5 top-[8rem] text-secondary">
      <div className="flex border-secondary border-b w-full pb-3 items-center">
        <TbFilter className="text-secondary mx-2 text-2xl" />
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
        {categoryData.map((category) => (
          <div key={category.name} className="flex items-center mb-1">
            <input
              type="radio"
              className="bg-transparent mr-1"
              name="category"
              value={category.id}
              checked={selectedCategory === category.id}
              onChange={handleCategoryChange}
            />
            <div className="text-sm whitespace-nowrap ml-1">{category.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</div>
          </div>
        ))}
      </div>
      {isFilterEnabled && (
        <div className="flex">
          <button
            onClick={() => {
              router.push(`/${route}`);
              setTimeout(() => window.location.reload(), 10);
            }} 
            className="hover:cursor-pointer flex items-center justify-center bg-transparent border border-secondary text-secondary text-sm w-fit h-fit px-3 py-1 rounded-full mr-2"
          >
            <RiCloseCircleLine className="text-md" />
            <div className="font-semibold ml-2">Clear filters</div>
          </button>


        </div>
      )}
    </nav>
  );
};

export default FilterBar;
