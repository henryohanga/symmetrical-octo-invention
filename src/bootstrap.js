const User = require('./api/v1/user/model');
const Manufacturer = require('./api/v1/manufacturer/model');

const Sequence = require('./api/v1/admin/sequence-model');

const createAdmin = async () => {
  // eslint-disable-next-line consistent-return
  User.findOne({ role: 'admin' }, (err, res) => {
    if (err) {
      console.log('error finding admin user \n', err);
    } else {
      if (res) {
        console.log('admin user exists \n Admin Email ', res.email, '\n');

        return true;
      }
      const admins = [
        {
          email: 'admin@express.com',
          first_name: 'Admin',
          is_verified: true,
          last_name: 'User',
          password: 'admin@123',
          role: 'admin',
        },
      ];

      User.insertMany(admins, (error, response) => {
        if (error) {
          console.log('Error creating admin user');

          return true;
        }
        console.log('Admin user created \n', JSON.stringify(response), '\r\n');

        return true;
      });
    }
  });
};

const counter = async () => {
  Sequence.findOne({}, (err, res) => {
    if (err) {
      console.log('Error checking auto increment sequence \n');
    } else if (res === null) {
      Sequence({ counter: 1000 }).save((error, response) => {
        if (error) {
          console.log('Error adding the auto increment counter \n');
        } else {
          console.log('Auto increment counter set value ', response, '\n');
        }
      });
    } else {
      console.log('Auto increment counter already there value \n Current counter value ', res.counter);
    }
  });
};

const createManufacturer = async () => {
  // eslint-disable-next-line consistent-return
  Manufacturer.findOne({ nickname: 'muthaiga-industrials' }, (err, res) => {
    if (err) {
      console.log('error finding manufacturer \n', err);
    } else {
      if (res) {
        console.log('Manufacturer Exists \n');

        return true;
      }
      const device = [ 
        {
          name: 'Muthaiga Industrials',
          nickname: 'muthaiga-industrials',
          location: "Kiambu Road"
        }
      ];

      Manufacturer.insertMany(device, (error, response) => {
        if (error) {
          console.log('Error creating manufacturer');

          return true;
        }
        console.log('Manufacturer created \n', JSON.stringify(response), '\r\n');
        return true;
      });
    }
  });
  Manufacturer.findOne({ nickname: 'other-industrials' }, (err, res) => {
    if (err) {
      console.log('error finding manufacturer \n', err);
    } else {
      if (res) {
        console.log('Manufacturer Exists \n');

        return true;
      }
      const device = [ 
        {
          name: 'Other',
          nickname: 'other-industrials',
          location: "Kirinyaga Road"
        },
      ];

      Manufacturer.insertMany(device, (error, response) => {
        if (error) {
          console.log('Error creating manufacturer');

          return true;
        }
        console.log('Manufacturer created \n', JSON.stringify(response), '\r\n');
        return true;
      });
    }
  });
};
module.exports = {
  counter,
  createAdmin,
  createManufacturer
};
