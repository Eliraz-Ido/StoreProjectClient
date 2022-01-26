function SaleComponent(props) {
    return(
        <div className={"sale"} style={props.style}>
            {props.sale.shop.shopName}<br/>
            {props.sale.description}<br/>
            Start at: {new Date(props.sale.startDate).toLocaleString()}<br/>
            End at: {new Date(props.sale.endDate).toLocaleString()}<br/>
        </div>
    );
}
export default SaleComponent;