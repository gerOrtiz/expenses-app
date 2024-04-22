'use client';

import AccountDataContext from "@/components/providers/account-recurrent-context";
import { createCategories } from "@/lib/user/account-movements";
import { faCheck, faL, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dialog, DialogBody, DialogFooter,
  DialogHeader, IconButton, Input, List, ListItem,
  ListItemSuffix, Typography
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";


export default function CategoriesDialog() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleOpen = () => setIsOpen((cur) => !cur);
  const accountRecurrentCtx = useContext(AccountDataContext);

  useEffect(() => {
    const recurrentData = accountRecurrentCtx.getAccountData();
    if (recurrentData) setCategoryList(recurrentData.categories);
  }, [accountRecurrentCtx]);

  async function saveCategories() {
    //Verify if no categories first
    setIsSaving(true);
    const response = await createCategories(categoryList);
    let newAccountData = {};
    if (accountRecurrentCtx.getAccountData() != null) newAccountData = { ...accountRecurrentCtx.getAccountData() };
    newAccountData.categories = categoryList;
    accountRecurrentCtx.updateAccountData(newAccountData);
    setIsSaving(false);
    handleOpen();
  }

  function addNewCategory(newCategory) {
    let newCategoriesArray = [...categoryList];
    newCategoriesArray.push(newCategory);
    setCategoryList(newCategoriesArray);
  }

  function deleteCategory(index) {
    let newCategoriesArray = [...categoryList];
    newCategoriesArray.splice(index, 1);
    setCategoryList(newCategoriesArray);
  }

  function addNewSubcategory(newCategory) {
    let newCategoriesArray = [...categoryList];
    let newSubcategoriesArray = [...selectedCategory.children];
    newSubcategoriesArray.push(newCategory);

    let index = categoryList.findIndex((category) => category.name == selectedCategory.name);
    if (index != -1) {
      newCategoriesArray[index].children = newSubcategoriesArray;
      setCategoryList(newCategoriesArray);
    }
  }

  function deleteSubcategory(index) {
    let newCategoriesArray = [...categoryList];
    let newSubcategoriesArray = [...selectedCategory.children];
    newSubcategoriesArray.splice(index, 1);
    let parentCategoryIndex = newCategoriesArray.findIndex((category) => category.name == selectedCategory.name);
    if (parentCategoryIndex != -1) {
      newCategoriesArray[parentCategoryIndex].children = newSubcategoriesArray;
      setCategoryList(newCategoriesArray);
    }
  }

  return (<>
    <Dialog
      size="md"
      open={isOpen}
      handler={handleOpen}
    >
      <DialogHeader>
        <div>
          <Typography variant="h5" color="blue-gray">
            Categorías
          </Typography>
          <Typography color="gray" variant="paragraph">
            Crea o elimina categorías. Selecciona una categoría para ver subcategorías.
          </Typography>
        </div>
      </DialogHeader>
      <DialogBody >
        <section className="grid grid-cols-2 flex gap-6">
          <div className="flex-col gap-4">
            <AddCategories isSubcategory={false} list={categoryList} callback={addNewCategory} />
            {categoryList && categoryList.length > 0 &&
              <CategoriesList list={categoryList} deleteHandler={deleteCategory} categorySelectionHandler={setSelectedCategory} isSubcategory={false} />}
          </div>
          <div className="flex-col gap-4">
            {selectedCategory && <>
              <AddCategories isSubcategory={true} list={selectedCategory.children} callback={addNewSubcategory} />
              <CategoriesList list={selectedCategory.children} isSubcategory={true} deleteHandler={deleteSubcategory} />
            </>}
          </div>
        </section>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancelar</span>
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={saveCategories}
          loading={isSaving}
        >
          <span>Guardar</span>
        </Button>
      </DialogFooter>
    </Dialog>
  </>);
}

function AddCategories(props) {
  const [categoryName, setCategoryName] = useState('');
  const [isRepeatedCategory, setIsRepeatedCategory] = useState(false);
  const addCategoryHandler = () => {
    let newCategoriesArray = [...props.list];
    const index = newCategoriesArray.findIndex((o) => o.name == categoryName);
    if (index != -1) {
      setIsRepeatedCategory(true);
      return;
    }
    // newCategoriesArray.push(newCategory);
    let category = { name: categoryName };
    if (!props.isSubcategory) category.children = [];
    if (props.callback) props.callback(category);
    setCategoryName('');
  };
  return (<>
    <div className="flex gap-3 items-center">
      <Typography variant="small" color="blue-gray" className="font-normal">{props.isSubcategory ? 'Nueva subcategoría' : 'Nueva categoría:'}</Typography>
      <div className="relative flex w-full">
        <Input
          label="Categoría"
          id={props.isSubcategory ? 'subcategory' : 'category'} name={props.isSubcategory ? 'subcategory' : 'category'}
          type="text"
          containerProps={{
            className: "min-w-[24px] max-w-[160px]"
          }}
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
        />
        <IconButton variant="text" size="sm" className="rounded-full mr-1 !absolute right-1 top-1" disabled={!categoryName} onClick={addCategoryHandler}>
          <FontAwesomeIcon icon={faCheck} />
        </IconButton>
      </div>
    </div>
    {isRepeatedCategory && <Typography
      variant="small"
      color="red"
      className="items-center font-normal"
    >
      Categoría repetida
    </Typography>}
  </>);
}

function CategoriesList({ list, deleteHandler, categorySelectionHandler, isSubcategory }) {
  const [selected, setSelected] = useState(-1);
  const setSelectedCategory = (index, category) => {
    //category level validation
    if (isSubcategory) return;
    setSelected(index);
    if (categorySelectionHandler) categorySelectionHandler(category);
  };
  return (<>
    <List>
      {list.map((category, index) => (
        <ListItem key={index} ripple={false} className="py-1 pr-1 pl-4" selected={selected == index} onClick={() => setSelectedCategory(index, category)}>
          {category.name}
          <ListItemSuffix>
            <IconButton variant="text" size="sm" className="rounded-full" onClick={() => deleteHandler(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </ListItemSuffix>
        </ListItem>
      ))}
    </List>
  </>);
}