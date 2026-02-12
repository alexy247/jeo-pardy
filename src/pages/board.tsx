import { useParams } from "react-router-dom";
import { scores, categories } from "../data/data";

import TableData from "../components/table/table-data/TableData";
import TableHeader from "../components/table/table-header/TableHeader";
import TableRow from "../components/table/table-row/TableRow";
import Table from "../components/table/table/Table";
import HeaderFirst from "../components/header/header-first/HeaderFirst";

// import { useGame } from "../context/GameContext";

function Board() {
    const params = useParams();

    // const { 
    // user, 
    // loadQuestions, 
    // updateProgress, 
    // saveUserAnswer, 
    // createGameSession 
//   } = useGame();
  
//   const [questions, setQuestions] = useState([])
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [score, setScore] = useState(0)
//   const [sessionId, setSessionId] = useState(null)
//   const [loading, setLoading] = useState(true)

    return (<>
            <HeaderFirst>
                Таблица с игрой {params.id}
            </HeaderFirst>
            <Table>
                {categories.map((category) => (
                        <TableRow>
                        <TableHeader>
                            {category}
                        </TableHeader>
                        {scores.map((score) => (
                            <TableData>
                                {score}
                            </TableData>
                        ))}
                    </TableRow>
                ))}
            </Table>
        </>
    );
};

export default Board;