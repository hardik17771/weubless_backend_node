const ApiRepository = require("../Repository/ApiRepository"); // Importing the equivalent of ApiRepository

class ApiService {
  async login(arg) {
    const apiRepository = new ApiRepository();
    // console.log("login for API Service is hit");

    const data = await apiRepository.login(arg);
    // console.log("API SERVICE DATA", data);
    if (data.code === 200) {
      console.log("data", data);
      return { error_code: data.code, data };
    } else {
      return { error_code: data.code };
    }
  }

  async fetchUser(arg) {
    const apiRepository = new ApiRepository();

    const data = await apiRepository.fetchUser(arg);
    if (data.code === 200) {
      console.log("data", data);
      return { error_code: data.code, data };
    } else {
      return { error_code: data.code };
    }
  }

  async updateProfile(arg) {
    const apiRepository = new ApiRepository();
    const data = await apiRepository.updateProfile(arg);
    console.log("API fetch User SERVICE DATA", data);
    if (data.code === 200) {
      console.log("data", data);
      return { error_code: data.code, data };
    } else {
      return { error_code: data.code };
    }
  }

  async changePassword(arg) {
    const apiRepository = new ApiRepository();
    const update = await apiRepository.changePassword(arg);
    if (update.code === 200) {
      return { error_code: 204, data: update };
    } else {
      return { error_code: update.code };
    }
  }

  async register(arg) {
    try {
      const apiRepository = new ApiRepository();
      const create_user = await apiRepository.register(arg);
      // console.log("create user:" , create_user)
      if (create_user) {
        console.log("API Service create_user");
        console.log(create_user);
        return { error_code: 636 };
      } else {
        return { error_code: 637 };
      }
    } catch (error) {
      throw error; // Rethrow the error to be caught in the higher level
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

  async mainSubCategory(arg) {
    const apiRepository = new ApiRepository(); // Assuming ApiRepository is properly imported and initialized

    const data = await apiRepository.mainSubCategory(arg);
    // console.log("service data", data);
    if (data.code === 689) {
      return { code: data.code, list: data.subCategoriesList };
    } else {
      return { code: data.code };
    }
  }

  async SubCategory(arg) {
    const apiRepository = new ApiRepository(); // Assuming ApiRepository is properly imported and initialized

    const data = await apiRepository.SubCategory(arg);
    // console.log("service data", data);
    if (data.code === 689) {
      return { code: data.code, list: data.subSubCategoriesList };
    } else {
      return { code: data.code };
    }
  }

  async productsFromSubCategoryId(arg) {
    const apiRepository = new ApiRepository(); // Assuming ApiRepository is properly imported and initialized

    const data = await apiRepository.productsFromSubCategoryId(arg);
    console.log("service data", data);
    if (data.code === 684) {
      return { code: data.code, list: data.productsList };
    } else {
      return { code: data.code };
    }
  }

  async main_subcategoryproductLocation(arg) {
    // const data = new DataService();
    const apiRepository = new ApiRepository();
    const data = await apiRepository.main_subcategoryproductLocation(arg);

    if (data.code === 689) {
      return { code: data.code, list: data.subSubCategoriesList };
    } else {
      return { code: data.code };
    }
  }
}

module.exports = ApiService;
