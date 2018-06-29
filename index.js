const Sequelize = require('sequelize');
const Request = require('request');
const Express = require('express');

const App = Express();

const sequelize = new Sequelize('mysql://root@localhost:3306/review_syncer', {
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	sync: { force: false },
	underscored: true,
	dialectOptions: {
		collate: 'utf8_general_ci'
	}
});

const Review = sequelize.define('shopify_app_reviews', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	shopify_domain: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'shopify_domain'
	},
	app_slug: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'app_slug'
	},
	star_rating: {
		type: Sequelize.INTEGER,
		allowNull: true,
		field: 'star_rating'
	},
	previous_star_rating: {
		type: Sequelize.INTEGER,
		allowNull: true,
		field: 'previous_star_rating'
	},
	updated_at: {
		type: Sequelize.DATE,
		allowNull: true,
		field: 'updated_at'
	},
	created_at: {
		type: Sequelize.DATE,
		allowNull: true,
		field: 'created_at'
	}
});

app.get('/api', (req, res) => {

});

sequelize.sync().then(() => {
	Review.create({
		shopify_domain: "Cookie",
		app_slug: "Cookie"
	}).then(console.log);	
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

