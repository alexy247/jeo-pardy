const categories = ['Мемы', 'Угадай фильм', 'Огород'];

function Categories() {
    return (
        <div>
            <h1>Список категорий:</h1>
            <ul>
                {categories.map((category) => (
                    <li key={category}>
                      {category}  
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categories;