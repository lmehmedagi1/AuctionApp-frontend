import React, { useState, useEffect } from 'react'
import { Accordion, Card, ListGroup } from 'react-bootstrap'

function CategoryList(props) {

    const [categories, setCategories] = useState([{id: "", name: "", subcategories: [{id:"", name: ""}]}]);
    const [activeCategory, setActiveCategory] = useState("");

    useEffect(() => {
        let categoriesList = [];
        let data = props.categories;
        for (let i = 0; i<data.length; i++) {
            if (!data[i].superCategory) {
                let subcategories = data.filter(item => item.superCategory === data[i].id);
                categoriesList.push({id: data[i].id, name: data[i].name, subcategories: subcategories});
            }
        }
        setCategories(categoriesList);
    }, [props.categories]);

    const subcategoryClicked = choice => {
        props.subcategoryChange(choice);
    }

    const supercategoryClicked = choice => {
        if (activeCategory == choice.id) 
            setActiveCategory("");
        else {
            setActiveCategory(choice.id);
        }
        props.supercategoryChange(choice);
    }

    return (
        <div className="categoriesListContainer">
            <Accordion activeKey={activeCategory}>
                <div className="listTitle">
                    PRODUCT CATEGORIES
                </div>
                {categories.map((category, index) => (
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey={category.id} onClick={() => supercategoryClicked(category)}>
                        {category.name}{activeCategory==category.id ? <i className="fa fa-minus" aria-hidden="true"></i> : <i className="fa fa-plus" aria-hidden="true"></i>}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={category.id}>
                            <Card.Body>
                            <ListGroup>
                                {category.subcategories.map((subcategory, subindex) => (
                                    <ListGroup.Item action onClick={() => subcategoryClicked(subcategory)}>{subcategory.name} ({subcategory.quantity})</ListGroup.Item>
                                ))}
                            </ListGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                ))}
            </Accordion>
        </div>
    )
}

export default CategoryList;
