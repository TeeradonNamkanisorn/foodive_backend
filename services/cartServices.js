
exports.calculatePriceFromMenuList = async (menus, restaurantId) => {
    const optionPrices = await menuList(restaurantId);
    const menuPrices = await menuOption(restaurantId);
    
    console.log(optionPrices, menuPrices);
    
    let totalPrice;
    
    for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]
        totalPrice += menuPrices[menu.id];
        
        for (let j = 0; j < menus.menuOptions.length; j++) {
            const menuOption = menus[i].menuOptions[j];
            totalPrice += menus[i].menuOptions[j].price;
        }
    }
    return totalPrice;
}


exports.getCartMenuArrayWithoutOptions = async (menus) => {
    return menus.map(menu => ({
        name: menu.name,
        price: menu.price,
        comment: menu.comment,
    }))
}

exports.getCartMenuOptionsArray = async (menus, restaurantId)


//********* เขียนไว้เฉยๆยังไม่ได้ทดสอบ ************/
const getDetailedCart = async (idOnlyList, restaurantId) => {
    const optionPrices = await menuList(restaurantId);
    const menuPrices = await menuOption(restaurantId);

    const list = [];
    for (let i = 0; i < idOnlyList.length; i++) {
        
        const idOnlyMenu = idOnlyList[i];
        const menu = {};

        menu.price = menuPrices[currentMenu.id].price;
        menu.name = menuPrices[currentMenu.id].name;
        menu.menuOption = []

        for (let j = 0; j < idOnlyMenu.menuOptions.length; j++) {
            const idOnlyMenuOption = idOnlyMenu.menuOptions[j];
            const menuOption = {}
            menuOption.name = optionPrices[idOnlyMenuOption.id].name;
            menuOption.id = optionPrices[idOnlyMenuOption.id].id;
            menuOption.price = optionPrices[idOnlyMenuOption.id].price;
            
            menu.menuOption.push(menuOption)
        }

        list.push(menu);
    }

    return list
}