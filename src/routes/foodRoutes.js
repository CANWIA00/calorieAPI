const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const FatSecret = require('../FatSecret');
const fatSecret = new FatSecret();
const DayPlan = require("../models/DayPlan");
const moment = require('moment');
 
 
router.get('/foodsearch/:search', async (req, res) => {
  console.log(`Searching for food: ${req.params.search}`);
 
  try {
    const data = await fatSecret.callAPI('foods.search', {
      search_expression: req.params.search,
      max_results: 10
    });
 
    console.log('FatSecret API Raw Results:', data);
 
    let foods = data?.foods?.food;
 
    if (!foods) {
      return res.status(404).send({ error: 'No foods found', rawData: data });
    }
 
    if (!Array.isArray(foods)) {
      foods = [foods];
    }
 
    res.status(200).send(foods);
 
  } catch (err) {
    console.error('Error fetching food:', err.message);
    res.status(500).send({ error: 'Failed to fetch food data' });
  }
});
 

const privateKey = '7f58842e-546e-41ec-86cc-98688aff65e5';
router.use((req, res, next) => {
  const token = req.get('token');
 
 
  jwt.verify(token, privateKey, { algorithms: ["HS256"] }, (err, decoded) => {
    if (!err) {
      req.user = decoded 
      next();
    } else {
      res.status(401).send("Please login");
    }
  })
})
 
const changeDateFormat = (date) => {
  const firstFormat = moment.utc(date);
  const toUnix = moment(firstFormat).format()
  removeZ = toUnix.substring(0, 19)
  otherVar = ".000+00:00"
  finalValue = removeZ.concat(otherVar)
  return finalValue;
}
 
 
router.post('/newDayPlan', async (req, res) => {
 
  const date = changeDateFormat(req.body.date);
 
  try {
 
    const findExistingPlan = await DayPlan.find({ userId: req.body.userId, date: date })
 
    if (findExistingPlan.length < 1) {
 
      const newDayPlan = await DayPlan.create(req.body);
      console.log('newday plan', newDayPlan);
 
      const updateCreatedPlan = newDayPlan;
 
      if (req.body.meal.breakfast[0].servingSize === 0) {
        updateCreatedPlan.meal.breakfast.pop(req.body.meal.breakfast[0]);
      }
      if (req.body.meal.lunch[0].servingSize === 0) {
        updateCreatedPlan.meal.lunch.pop(req.body.meal.lunch[0]);
      }
      if (req.body.meal.dinner[0].servingSize === 0) {
        updateCreatedPlan.meal.dinner.pop(req.body.meal.dinner[0]);
      }
      if (req.body.meal.snack[0].servingSize === 0) {
        updateCreatedPlan.meal.snack.pop(req.body.meal.snack[0]);
      }
 
      const updateExistingPlan = await DayPlan.findOneAndUpdate({ date: date }, { $set: updateCreatedPlan }, { new: true })
 
      res.status(200).send(updateExistingPlan);
    } else {
      console.log("findExistingPlan", findExistingPlan);
      res.redirect(307, '/api/food/updateDayPlan');
    }
 
  } catch (e) {
    console.log('create error', e);
    res.status(400).send("Bad request");
  }
})
 
router.post('/updateDayPlan', async (req, res) => {
 
  const date = changeDateFormat(req.body.date);
 
  try {
    
    const findExistingPlan = await DayPlan.find({ userId: req.user.id, date: date })
 
    if (findExistingPlan.length >= 1) {

      const existingPlan = findExistingPlan[0];

      if (req.body.meal.breakfast[0].servingSize) {
        const findRepeatedFoodIndex = existingPlan.meal.breakfast.findIndex((food) => {
          console.log('food', food);
          return food.foodId == req.body.meal.breakfast[0].foodId;
        })

        if (findRepeatedFoodIndex >= 0) {
          existingPlan.meal.breakfast[findRepeatedFoodIndex].servingSize += parseInt(req.body.meal.breakfast[0].servingSize)
        } else {
          existingPlan.meal.breakfast.push(req.body.meal.breakfast[0]);
        }
      }
      if (req.body.meal.lunch[0].servingSize) {
        const findRepeatedFoodIndex = existingPlan.meal.lunch.findIndex((food) => {
          return food.foodId == req.body.meal.lunch[0].foodId;
        })
         console.log('findRepeatedFoodIndex',findRepeatedFoodIndex);
        if (findRepeatedFoodIndex >= 0) {
          existingPlan.meal.lunch[findRepeatedFoodIndex].servingSize += parseInt(req.body.meal.lunch[0].servingSize)
        } else {
          existingPlan.meal.lunch.push(req.body.meal.lunch[0]);
        }
      }
      if (req.body.meal.dinner[0].servingSize) {
        const findRepeatedFoodIndex = existingPlan.meal.dinner.findIndex((food) => {
          return food.foodId == req.body.meal.dinner[0].foodId;
        })
        if (findRepeatedFoodIndex >= 0) {
          existingPlan.meal.dinner[findRepeatedFoodIndex].servingSize += parseInt(req.body.meal.dinner[0].servingSize)
        } else {
          existingPlan.meal.dinner.push(req.body.meal.dinner[0]);
        }
      }
      if (req.body.meal.snack[0].servingSize) {
        const findRepeatedFoodIndex = existingPlan.meal.snack.findIndex((food) => {
          return food.foodId == req.body.meal.snack[0].foodId;
        })
        if (findRepeatedFoodIndex >= 0) {
          existingPlan.meal.snack[findRepeatedFoodIndex].servingSize += parseInt(req.body.meal.snack[0].servingSize)
        } else {
          existingPlan.meal.snack.push(req.body.meal.snack[0]);
        }
      }
 
      const updateExistingPlan = await DayPlan.findOneAndUpdate({ date: finalValue }, { $set: existingPlan }, { new: true })
      res.status(200).send(updateExistingPlan);
    } else {
      res.redirect(307, '/api/food/newDayPlan');
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
})
 
router.post('/dayPlan', async (req, res) => {
  try {
 
    const date = changeDateFormat(req.body.date);
 
    const dayPlan = await DayPlan.find({ userId: req.user.id, date: date });
    res.status(200).send(dayPlan);
  } catch (e) {
    console.log("e", e);
    res.status(400).send("bad request");
  }
})
 
router.get('/allDayPlan', async (req, res) => {
  try {
    console.log('userID', req.user.id);
    const dayPlan = await DayPlan.find({ userId: req.user.id });
    res.status(200).send(dayPlan);
  } catch (e) {
    console.log("e", e);
    res.status(400).send("bad request");
  }
})
 
router.delete('/deleteFood', async (req, res) => {
  const dayPlan = await DayPlan.findOne({ userId: req.user.id, _id: req.body.planId });
 
  let meal = null;

  switch (req.body.mealType) {
    case "breakfast":
      meal = dayPlan.meal.breakfast.id(req.body.mealId);
      break;
    case "lunch":
      meal = dayPlan.meal.lunch.id(req.body.mealId);
    break;
    case "dinner":
      meal = dayPlan.meal.dinner.id(req.body.mealId);
      break;
    case "snack":
      meal = dayPlan.meal.snack.id(req.body.mealId);
      break;
  }
  console.log('delete meal', dayPlan.meal)
  if(meal) {
    
    meal.foodId = req.body.meal.foodId;
    meal.servingSize = req.body.meal.servingSize;
    
    await meal.remove();
    await dayPlan.save();
  }
 
  if(dayPlan.meal.breakfast.length < 1
    && dayPlan.meal.lunch.length < 1
    && dayPlan.meal.dinner.length < 1
    && dayPlan.meal.snack.length < 1 ){
      await DayPlan.findOneAndDelete({ userId: req.user.id, _id: req.body.planId });
      console.log('entire food deleted')
    }
  res.json(dayPlan);
});
 
module.exports = router;