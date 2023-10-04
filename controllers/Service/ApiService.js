const ApiRepository = require("../Repository/ApiRepository"); // Importing the equivalent of ApiRepository

class ApiService {
  async login(arg) {
    const apiRepository = new ApiRepository();
    const data = await apiRepository.login(arg);
    if (data) {
      return { error_code: 200, data };
    } else {
      return { error_code: 430 };
    }
  }

  async changePassword(arg) {
    const apiRepository = new ApiRepository();
    const update = await apiRepository.changePassword(arg);
    if (update.code === 200) {
      return { error_code: 204, data: update };
    } else if (update.code === 410) {
      return { error_code: update.code };
    } else {
      return { error_code: 681 };
    }
  }

  async register(arg) {
    const apiRepository = new ApiRepository();
    const create_user = await apiRepository.register(arg);
    if (create_user) {
      return { error_code: 636 };
    } else {
      return { error_code: 637 };
    }
  }

  async save_token(arg, userId) {
    const apiRepository = new ApiRepository();
    const update = await apiRepository.save_token(arg, userId);
    if (update.code === 200) {
      return { error_code: 661, data: update };
    } else if (update.code === 410) {
      return { error_code: update.code };
    } else {
      return { error_code: 632 };
    }
  }

  async delete_account(arg, userId) {
    const apiRepository = new ApiRepository();
    const update = await apiRepository.delete_account(arg, userId);
    if (update.code === 200) {
      return { error_code: 661, data: update };
    } else if (update.code === 410) {
      return { error_code: update.code };
    } else {
      return { error_code: 632 };
    }
  }
}

module.exports = ApiService;
