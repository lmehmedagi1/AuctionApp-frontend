import React, { useState, useEffect } from 'react'
import { Accordion, Card, ListGroup } from 'react-bootstrap'

import categoriesApi from "../api/categories"

function CategoryList(props) {

    const [categories, setCategories] = useState([{id: "", name: "Test", subcategories: [{id:"", name: "test"}]}]);
    const [activeCategory, setActiveCategory] = useState("");

    useEffect(() => {
        categoriesApi.getAllCategories((message, variant, data) => {
            let categoriesList = [];
            for (let i = 0; i<data.length; i++) {
                if (!data[i].superCategory) {
                    let subcategories = data.filter(item => item.superCategory === data[i].id);
                    categoriesList.push({id: data[i].id, name: data[i].name, subcategories: subcategories});
                }
            }
            setCategories(categoriesList);

            if (props.initial != "") setActiveCategory(props.initial);
        });
    }, [props.initial]);

    const subcategoryClicked = choice => {
        props.subcategoryChange(choice);
    }

    const supercategoryClicked = choice => {
        if (activeCategory == choice.id) 
            setActiveCategory("");
        else {
            setActiveCategory(choice.id);
            props.supercategoryChange(choice.id);
        }
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
                                    <ListGroup.Item action onClick={() => subcategoryClicked(subcategory.id)}>{subcategory.name} ({subcategory.quantity})</ListGroup.Item>
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
