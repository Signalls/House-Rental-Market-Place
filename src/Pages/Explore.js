import React from "react";
import { Link } from "react-router-dom";
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from "../Components/Slider";

function Explore() {
    return (
        <div className="explore" >
            <header className="exploreHeader">
                <p className="pageHeader">Discover Your Dream Home</p>
            </header>
            <main>
                <Slider />
                <div className="exploreCategories">
                    <Link to='category/rent' className="categoryLink">
                        <div className="categoryCard">
                            <img src={rentCategoryImage} className="exploreCategoryImg" alt="Rent" />
                            <p className="exploreCategoryName">Places for Rent</p>
                        </div>
                    </Link>
                    <Link to='category/sell' className="categoryLink">
                        <div className="categoryCard">
                            <img src={sellCategoryImage} className="exploreCategoryImg" alt="Sell" />
                            <p className="exploreCategoryName">Places for Sale</p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default Explore;
