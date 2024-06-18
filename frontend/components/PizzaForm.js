import React, { useState, useEffect } from'react';
import { useDispatch, useSelector } from'react-redux';
import { submitPizzaOrder, resetOrderState } from '../state/pizzaOrderSlice';
import { fetchPizzaHistory } from '../state/pizzaSlice';
import {
  setSizeFilter,
  selectFilteredPizzaHistory,
} from '../state/sizeFilterSlice'
const initialFormState = {
  fullName: '',
  size: '',
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
};

export default function PizzaForm() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.pizzaOrder);

  const filterSize = useSelector((state) => state.sizeFilter);
  const [formState, setFormState] = useState(initialFormState);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFilterClick = (size) => {
    dispatch(setSizeFilter(size))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, size, ...toppingState } = formState;
    const toppings = Object.keys(toppingState).filter(
      (key) => toppingState[key]
    );
    dispatch(submitPizzaOrder({ fullName, size, toppings }))
      .then(() => {
        dispatch(fetchPizzaHistory());
      })
      .catch((error) => console.error('Order submission failed:', error));
  };

  //Automatically reset form state on successful order submission
  useEffect(() => {
    if (success) {
      setFormState(initialFormState);
      dispatch(resetOrderState());
    }
  }, [success, dispatch]);

  return (
    <div>
      <h2>Pizza Form</h2>
      {loading && <div className='pending'>Order in progress</div>}
      {error && <div className='failure'>Order failed: {error.message}</div>}
      {success && <div className='success'>Order submitted successfully!</div>}
      <form onSubmit={handleSubmit}>
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value={formState.fullName}
            onChange={handleChange}
            required=''
          />
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select 
            data-testid="sizeSelect" 
            id="size" 
            name="size"
            value={formState.size}
            onChange={handleChange}
          >
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label>
          <input 
            data-testid="checkPepperoni" 
            name="1" 
            type="checkbox" 
            checked={formState['1']}
            onChange={handleChange} 
          />
          Pepperoni
          <br />
          </label>
        <label>
          <input 
            data-testid="checkGreenpeppers" 
            name="2" 
            type="checkbox" 
            checked={formState['2']}
            onChange={handleChange} 
          />
          Green Peppers
          <br />
          </label>
        <label>
          <input 
            data-testid="checkPineapple" 
            name="3" 
            type="checkbox" 
            checked={formState['3']}
            onChange={handleChange} 
          />
          Pineapple
          <br />
          </label>
        <label>
          <input 
            data-testid="checkMushrooms" 
            name="4" 
            type="checkbox" 
            checked={formState['4']}
            onChange={handleChange} 
          />
          Mushrooms
          <br />
          </label>
        <label>
          <input 
            data-testid="checkHam" 
            name="5" 
            type="checkbox" 
            checked={formState['5']}
            onChange={handleChange} 
          />
          Ham
          <br />
          </label>
      </div>
      <input 
        data-testid="submit" 
        type="submit" 
        value='Submit'
        disabled={loading}
      />
    </form>
    <div id='sizeFilters' style={{display:'none'}}>
      Filter by size:
      {['All', 'S', 'M', 'L'].map((size) => {
        const className = `button-filter${
          size === filterSize ? ' active' : ''
        }`;
        return (
        <button
          className={className}
          key={size}
          onClick = {() => handleFilterClick(size)}
          data-testid={`filterBtn${size}`}
          >
            {size}
          </button>
        );
      })}
      </div>
    </div>
  );
}