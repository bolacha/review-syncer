const Sequelize = require('sequelize');
const Request = require('request-promise');
const Express = require('express');
const Moment = require('moment');
const Cors = require('cors');
var Cron = require('node-cron');


const App = Express();

App.use(Cors());

const sequelize = new Sequelize('mysql://root@localhost:3306/review_syncer', {
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	sync: { force: false },
	operatorsAliases: false,
	define : {
		timestamps: false,
		underscored: true,
		charset: 'utf8',
	    dialectOptions: {
	      collate: 'utf8_general_ci'
	    }
	},
	logging: false
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
	created_at: {
		type: Sequelize.DATE,
		allowNull: true
	},
	updated_at: {
		type: Sequelize.DATE,
		allowNull: true
	}
});

const reviewBuilder = (data, app_slug) => {
	let return_data = {
		shopify_domain: data.shop_domain,
		app_slug: app_slug,
		star_rating: data.star_rating,
		previous_star_rating: data.star_rating,
		created_at : Moment( data.created_at ).format('YYYY-MM-DD HH:mm:ss'),
		updated_at : Moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
	};
	return return_data;
}

App.get('/shopify/:app_slug/reviews', (req, res) => {

	Request({
	    method: 'GET',
	    uri: `https://apps.shopify.com/${req.params.app_slug}/reviews.json`,
	    json: true
	}).then((parsed_body) => {
		let reviews = parsed_body.reviews.map((parsed_review) => {
			return reviewBuilder(parsed_review, req.params.app_slug);
		});

		for (let review of reviews) {

			if(review === undefined || review.shopify_domain === undefined) continue;

			const whereclause = {where: {app_slug: req.params.app_slug , shopify_domain: review.shopify_domain } , defaults: review};

			Review.findOrCreate(whereclause)
				.spread((stored_review, created) => {

					let plain_data = stored_review.get({
						plain: true
					});

					if(created === false && plain_data.star_rating !== review.star_rating ) {

						// Keeping the old star rating
						plain_data.previous_star_rating = review.star_rating;
						// removing the created_at
						if (review.created_at) delete review.created_at;

						let object_assigned = Object.assign(plain_data, review);

						object_assigned.updated_at = Moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

						Review.update( object_assigned, whereclause ).then(console.log).catch(console.log);
					}
				});
		}

		res.send();
	});
});

App.get('/api/:app_slug/reviews', (req, res) => {

	const whereclause = {where: {app_slug: req.params.app_slug}};

	Review.findAll(whereclause)
		.then((all) => {
			res.send(all);
		});
});

Cron.schedule('0,30 * * * *', function() {

	console.log('Started Syncing');

	let array_appslugs = ['product-upsell','product-discount','store-locator','product-options','quantity-breaks','product-bundles','customer-pricing','product-builder','social-triggers','recurring-orders','multi-currency','quickbooks-online','xero','the-bold-brain' ];

	for(let appSlugs in array_appslugs) {

		appSlugs = array_appslugs[appSlugs];

		console.log(` Started Syncing for ${appSlugs}`);

		Request({
		    method: 'GET',
		    uri: `https://apps.shopify.com/${appSlugs}/reviews.json`,
		    json: true
		}).then((parsed_body) => {
			let reviews = parsed_body.reviews.map((parsed_review) => {
				return reviewBuilder(parsed_review, appSlugs);
			});

			for (let review of reviews) {

				if(review === undefined || review.shopify_domain === undefined) continue;

				const whereclause = {where: {app_slug: appSlugs , shopify_domain: review.shopify_domain } , defaults: review};

				Review.findOrCreate(whereclause)
					.spread((stored_review, created) => {

						let plain_data = stored_review.get({
							plain: true
						});

						if(created === false && plain_data.star_rating !== review.star_rating ) {

							// Keeping the old star rating
							plain_data.previous_star_rating = review.star_rating;
							// removing the created_at
							if (review.created_at) delete review.created_at;

							let object_assigned = Object.assign(plain_data, review);

							object_assigned.updated_at = Moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

							Review.update( object_assigned, whereclause ).then(console.log);
						}
					});
			}
		});
	}
});


App.listen(3000, () => console.log('Example app listening on port 3000!'))

