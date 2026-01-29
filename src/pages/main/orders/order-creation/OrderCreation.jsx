import React from "react";
import "./order-creation.css";
import { IoMdArrowForward } from "react-icons/io";
import { categories } from "../../../../utils/helpers/OrderCategories";
import { useOrderContext } from "../../../../providers/OrderProvider";
import PulseLoader from "react-spinners/PulseLoader";
import { useRef, useState } from "react";
import { calculatePrice } from "../../../../utils/helpers/pricing";
import { useCallback } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const OrderCreation = () => {
  const { createOrder, submitLoading } = useOrderContext();
  const [titleLimit, setTitleLimit] = useState(false);
  const maxChars = 80;
  const titleRef = useRef("");

  const getTitleLength = () => {
    const title = titleRef.current.value;
    if (title.length === maxChars) {
      setTitleLimit(true);
      return;
    }
    setTitleLimit(false);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  const currentDate = new Date();

  // Add 3 hours to the current date
  const modifiedDate1 = new Date(currentDate.getTime());
  modifiedDate1.setHours(currentDate.getHours() + 3);
  const minDate = formatDate(modifiedDate1);

  const [fullCategory, setFullCategory] = useState(categories[0]);
  const [subCategory, setSubCategory] = useState(fullCategory.subCategory);
  const [category, setCategory] = useState(fullCategory.category);
  const [orderMilestoneCount, setorderMilestoneCount] = useState(1);
  const [deadline, setDeadline] = useState();

  const unit = fullCategory.unit;

  const [price, setPrice] = useState(
    calculatePrice(unit, orderMilestoneCount, deadline)
  );

  const [priceErr, setPriceErr] = useState();

  function checkAmount(amt) {
    if (parseFloat(amt) < parseFloat(price)) {
      setPriceErr(`Amount should be higher than or $${price}`);
    } else {
      setPriceErr();
    }
  }

  function getPrice() {
    const price = calculatePrice(
      fullCategory.unit,
      orderMilestoneCount,
      deadline
    );
    setPrice(price.toFixed(2));
  }

  function setSelectedSubcategory(e) {
    const ctg = categories.find((item) => item.category === e.target.value);

    if (
      category !=
      (category === "Writing" ||
        category === "Programming" ||
        category === "Class Work")
    ) {
      setorderMilestoneCount(1);
    }

    setCategory(ctg.category);
    setFullCategory(ctg);
    setSubCategory(ctg.subCategory);
  }

  useEffect(() => {
    getPrice();
  }, [category, orderMilestoneCount, deadline]);

  return (
    <div className="order-creation">
      <strong>Create a new order</strong>
      <form className="order-creation-details" onSubmit={(e) => createOrder(e)}>
        <div className="order-required-details">
          <div>
            {/* <div> */}
            <label htmlFor="title">Title</label>
            {/* </div> */}
            <input
              style={{
                outlineColor: titleLimit && "orange",
                borderColor: titleLimit && "orange",
              }}
              required
              ref={titleRef}
              onChange={getTitleLength}
              maxLength={maxChars}
              id="title"
              type="text"
              placeholder="Enter the title"
            />
            {titleLimit && (
              <span className="text-limit-helper">Reached title limit</span>
            )}
          </div>
          <div>
            {/* <div> */}
            <label htmlFor="category">Category</label>
            {/* </div> */}
            <select
              required
              name="category"
              id="category"
              onChange={(e) => setSelectedSubcategory(e)}
            >
              {categories.map((category, index) => {
                return (
                  <option key={index} value={category.category}>
                    {category.category}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="sub-category">Subject</label>
            <select required name="sub-category" id="subCategory">
              {subCategory?.map((subCategory, index) => {
                return (
                  <option key={index} value={subCategory}>
                    {subCategory}
                  </option>
                );
              })}
            </select>
          </div>
          {category === "Writing" && (
            <div>
              <label htmlFor="page-count">Page Count</label>
              <input
                onChange={(e) =>
                  e.target.value && setorderMilestoneCount(e.target.value)
                }
                required
                id="pages"
                name="page-count"
                type="number"
                min={1}
                max={100}
                defaultValue={1}
              />
            </div>
          )}
          {category === "Class Work" && (
            <div>
              <label htmlFor="class-page-count">Page Count</label>
              <input
                onChange={(e) =>
                  e.target.value && setorderMilestoneCount(e.target.value)
                }
                required
                id="pages"
                name="class-page-count"
                type="number"
                min={1}
                max={100}
                defaultValue={1}
              />
            </div>
          )}
          {category === "Programming" && (
            <div>
              <label htmlFor="">Milestones</label>
              <input
                onChange={(e) =>
                  e.target.value && setorderMilestoneCount(e.target.value)
                }
                id="milestones"
                name="count"
                type="number"
                min={1}
                max={100}
                defaultValue={1}
              />
            </div>
          )}

          <div>
            <label htmlFor="file">Upload file</label>
            <input id="attachment" type="file" accept="" />
          </div>
          <div>
            <label htmlFor="deadline">Deadline</label>
            <input
              required
              type="datetime-local"
              id="deadline"
              min={minDate}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>
        <div className="instructions-box">
          <div>
            <div>
              <label htmlFor="instructions">Instructions</label>
            </div>
            <textarea
              style={{
                resize: "none",
              }}
              rows={4}
              type="text"
              id="instructions"
              placeholder="Tell us more about your task"
            />
          </div>
        </div>
        <div className="amount-box">
          <div>
            <div>
              <label htmlFor="amount">Amount ($)</label>
              <br />
              {priceErr && (
                <small style={{ color: "orange" }}>{priceErr}</small>
              )}
            </div>
            <div className="amount-input">
              <article className="dollar-icon">$</article>
              <input
                onChange={(e) => checkAmount(e.target.value)}
                required
                type="number"
                id="amount"
                placeholder={`${price}`}
                // defaultValue={price}
                min={price}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "1rem 0",
            height: "2rem",
          }}
        >
          {submitLoading ? (
            <PulseLoader color="#374151" />
          ) : (
            <button type="submit" className="create-task">
              Create <IoMdArrowForward size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrderCreation;
