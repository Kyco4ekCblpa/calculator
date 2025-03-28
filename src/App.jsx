import React, { useState } from "react";

import './App.css';

export default function CostCalculator() {
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [markupEnabled, setMarkupEnabled] = useState(false);
  const [markup, setMarkup] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [customDiscount, setCustomDiscount] = useState("");

  const maxPrice = 1800;
  const maxWeight = 55;
  const priceForNorm = 180;

  const calculateCost = () => {
    const priceValue = parseFloat(price);
    const weightValue = parseFloat(weight);

    if (isNaN(priceValue) || isNaN(weightValue) || priceValue <= 0 || weightValue <= 0) {
      return { cost: "Некоректні дані", method: "Некоректні дані" };
    }

    let priceRatio = maxPrice / priceValue;
    let weightRatio = maxWeight / weightValue;
    let cost, method;

    if (priceValue < maxPrice && weightValue < maxWeight) {
      if (priceRatio <= weightRatio) {
        cost = priceValue + priceValue * 0.06 + priceForNorm / priceRatio;
        method = "Розрахунок по ціні";
      } else {
        cost = priceValue + priceValue * 0.06 + priceForNorm / weightRatio;
        method = "Розрахунок по вазі";
      }
    } else {
      cost = priceValue + priceValue * 0.06 + priceValue * 0.33;
      method = "Стандартний розрахунок (ціна + 6% + 33%)";
    }

    cost = Math.round(cost * 100) / 100;
    return { cost, method };
  };

  const { cost, method } = calculateCost();

  const calculateFinalPrice = () => {
    if (!markupEnabled) return null;
    const markupValue = parseFloat(markup) / 100;
    const rateValue = parseFloat(exchangeRate);

    if (isNaN(markupValue) || isNaN(rateValue) || markupValue < 0 || rateValue <= 0) {
      return "Некоректні дані";
    }

    let finalPrice = (cost + cost * markupValue) * rateValue;
    return Math.round(finalPrice);
  };

  const calculateDiscount = (finalPrice, percent) => {
    return `${Math.floor(finalPrice * (percent / 100))} грн`;
  };

  const finalPrice = calculateFinalPrice();

  return (
    <div className="container">
      <div className="form-group">
        <label>Ціна товару</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          placeholder="Введіть ціну"
        />
      </div>
      <div className="form-group">
        <label>Вага товару</label>
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          type="number"
          placeholder="Введіть вагу"
        />
      </div>
      <div className="result">
        <strong>Розрахована собівартість (PLN):</strong> {cost}
      </div>
      <div className="result">
        <strong>Метод розрахунку:</strong> {method}
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={markupEnabled}
          onChange={() => setMarkupEnabled(!markupEnabled)}
        />
        <label>Додати націнку</label>
      </div>
      {markupEnabled && (
        <>
          <div className="form-group">
            <label>% Націнки</label>
            <input
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              type="number"
              placeholder="Введіть %"
            />
          </div>
          <div className="form-group">
            <label>Курс Валюти</label>
            <input
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              type="number"
              placeholder="Введіть курс"
            />
          </div>
          <div className="result">
            <strong>Кінцева ціна (грн):</strong> {calculateFinalPrice()}
          </div>
          <div className="result">
            <strong>Знижка 2%:</strong> {calculateDiscount(finalPrice, 2)}
          </div>
          <div className="result">
            <strong>Знижка 4%:</strong> {calculateDiscount(finalPrice, 4)}
          </div>
          <div className="form-group">
            <label>Кастомна знижка (%)</label>
            <input
              value={customDiscount}
              onChange={(e) => setCustomDiscount(e.target.value)}
              type="number"
              placeholder="Введіть %"
            />
          </div>
          <div className="result">
            <strong>Сума кастомної знижки:</strong> {customDiscount ? calculateDiscount(finalPrice, parseFloat(customDiscount)) : "-"}
          </div>
        </>
      )}
    </div>
  );
}
