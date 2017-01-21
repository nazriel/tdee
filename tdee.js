// Total Daily Energy Expenditure
function TDEE (data) {
	this.weight = data.weight || 60
	this.height = data.height || 180
	this.age = data.age || 20
	this.sex = data.sex || 'male'
	this.bodyFat = data.bodyFat || 0
	this.bodyType = data.bodyType || 'ectomorph'
	this.dailyEnergy = data.dailyEnergy || 0
	this.numberOfWorkouts = data.numberOfWorkouts || 0
	this.durationOfWorkout = data.durationOfWorkout || 0
	this.ratios = data.ratios || {
		protein: 35,
		carb: 45,
		fat: 20
	}
}

// Basal Metabolic Rate
TDEE.prototype.calculateBMR = function () {
	if (this.bodyFat != 0) {
		var leanBodyMass = this.weight - (this.weight * (this.bodyFat / 100))
		return Math.floor(370 + (21.6 * leanBodyMass))
	}
	var weightFactor = 9.99
	var heightFactor = 6.25
	var ageFactor = 4.92	
	var result = ((weightFactor * weight) + (heightFactor * this.height) - (ageFactor * this.age))

	return Math.floor(this.sex == 'male' ? result + 5 : result - 161)
}

// calories used during physical activity
TDEE.prototype.calculateTEA = function () {
	var strengthTrening = function(self) {
		if (self.numberOfWorkouts == 0 || self.durationOfWorkout == 0) { 
			return 0;
		}
		// strength exercises consume 7 - 9 kcal/minute
		var kcalpm = 9
		// EPOC calories used after workout, ~ 4% - 7% total calories intake
		var percentOfBMR = Math.floor((7 * self.calculateBMR()) / 100)
		var EPOC = (self.numberOfWorkouts * percentOfBMR)
		// console.log(EPOC)

		// 3x60 mins x 9kcal + EPOC(3x(0.07 x calculateBMR))
		// results are divided by number of weekdays
		return Math.floor((self.numberOfWorkouts * self.durationOfWorkout * kcalpm + EPOC) / 7)
	}(this);

	var cardioTrening = function(self) {
		// TODO: implement me
		return 0
	}(this);

	return strengthTrening + cardioTrening
}

// NEAT - thermogenesis not including workouts
TDEE.prototype.calculateNEAT = function () {
	if (this.dailyEnergy) {
		return this.dailyEnergy
	}

	var body = {
		endomorph: 300, // endomorph 200-400 kcal
		ectomorph: 800, // ectomorph 700-900 kcal
		mesomorph: 450  // mesomorph 400-500 kcal
	}

	return body[this.bodyType]
}

TDEE.prototype.getMacronutrients = function () {
	var calories = this.getTotal()
	return {
		protein: Math.floor(calories * this.ratios.protein / 100 / 4),
		carb: Math.floor(calories * this.ratios.carb / 100 / 4),
		fat: Math.floor(calories * this.ratios.fat / 100 / 9)
	}
}

TDEE.prototype.calculateTEF = function() {
	return Math.floor((this.calculateBMR() + this.calculateTEA() + this.calculateNEAT()) / 10)
}

TDEE.prototype.getTotal = function () {
	var BMR = this.calculateBMR()
	var TEA = this.calculateTEA()
	var NEAT = this.calculateNEAT()
	return this.calculateBMR() + this.calculateTEA() + this.calculateNEAT() + this.calculateTEF()
}

var ratios = [
	{
		name: 'high-carb for bodybuilding',
		carb: 50, // 40-60
		protein: 30, // 25-35
		fat: 20 // 15-25
	},
	{
		name: 'moderate-carb for maitenance',
		carb: 40, // 30-50
		protein: 30, // 25-35
		fat: 30 // 25-35
	},
	{
		name: 'low-carb for reduction',
		carb: 20, // 10-20
		protein: 50, // 40-50
		fat: 30 // 30-40
	}
]

var qmmr = {
	weight: 83.7,
	height: 170,
	bodyFat: 17.8,
	age: 26,
	sex: 'male',
	bodyType: 'endomorph',
	dailyEnergy: 300,
	numberOfWorkouts: 0,
	durationOfWorkout: 0,
	ratios: ratios[1]
}

var tdee = new TDEE(qmmr)
console.log('BMR: ', tdee.calculateBMR())
console.log('TEA: ', tdee.calculateTEA())
console.log('NEAT: ', tdee.calculateNEAT())
console.log('TEF: ', tdee.calculateTEF())
console.log('TOTAL: ' + tdee.getTotal() + ' kcal')
console.log('Chosen ratio -> ' + qmmr.ratios.name + ':')
console.log('carb: ' + qmmr.ratios.carb + '%')
console.log('protein: ' + qmmr.ratios.protein + '%')
console.log('fat: ' + qmmr.ratios.fat + '%')
console.log('Your daily macronutrients:')
console.log('Proteins: ' + tdee.getMacronutrients().protein + 'g')
console.log('Carbs: ' + tdee.getMacronutrients().carb + 'g')
console.log('Fats: ' + tdee.getMacronutrients().fat + 'g')
