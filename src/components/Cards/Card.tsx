import { PlusCircle } from "react-feather";
import "./Card.css";

function Card({ title, children, actions, selectable, className }: any) {
    return (
        <div className={`card ${className || ""}`}>
            <div className="card-header">
                <h3>{title}</h3>


                <div className="actions">
                    {actions && <button className="add"><PlusCircle />New</button>}
                    {selectable && (
                        <select>
                            <option>The Fiscal Year</option>
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                    )}
                </div>
            </div>

            <div className="card-body">{children}</div>
        </div>
    );


}

export default Card;
