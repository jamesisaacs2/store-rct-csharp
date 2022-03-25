import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/util/util";
import BasketSummary from "./BasketSummary";

export default function BasketPage() {
	const { basket, setBasket, removeItem } = useStoreContext(); //v1 below

	const [status, setStatus] = useState({
		loading: false,
		name: "",
	});

	function handleAddItem(productId: number, name: string) {
		setStatus({ loading: true, name });
		agent.Basket.addItem(productId)
			.then((basket) => setBasket(basket))
			.catch((error) => console.log(error))
			.finally(() => setStatus({ loading: false, name: "" }));
	}

	function handleRemoveItem(productId: number, quantity = 1, name: string) {
		setStatus({ loading: true, name });
		agent.Basket.removeItem(productId, quantity)
			.then(() => removeItem(productId, quantity))
			.catch((error) => console.log(error))
			.finally(() => setStatus({ loading: false, name: "" }));
	}

	if (!basket) return <Typography variant="h3">Your basket is empty</Typography>;

	const greenBtn = green[400];

	return (
		<>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }}>
					<TableHead>
						<TableRow>
							<TableCell>Product</TableCell>
							<TableCell align="right">Price</TableCell>
							<TableCell align="center">Quantity</TableCell>
							<TableCell align="right">Subtotal</TableCell>
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{basket.items.map((item) => (
							<TableRow
								key={item.productId}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									<Box display="flex" alignItems="center">
										<img
											src={item.pictureUrl}
											alt={item.name}
											style={{ height: 50, marginRight: 20 }}
										/>
										<span>{item.name}</span>
									</Box>
								</TableCell>
								<TableCell align="right">{currencyFormat(item.price)}</TableCell>
								<TableCell align="center">
									<LoadingButton
										loading={
											status.loading && status.name === "remove" + item.productId
										}
										onClick={() =>
											handleRemoveItem(item.productId, 1, "remove" + item.productId)
										}
										color="warning"
										size="small"
									>
										<Remove />
									</LoadingButton>
									{item.quantity}
									<LoadingButton
										loading={status.loading && status.name === "add" + item.productId}
										onClick={() =>
											handleAddItem(item.productId, "add" + item.productId)
										}
										color="success"
										size="large"
									>
										<Add />
									</LoadingButton>
								</TableCell>
								<TableCell align="right">
									{currencyFormat(item.price * item.quantity)}
								</TableCell>
								<TableCell align="right">
									<LoadingButton
										loading={
											status.loading && status.name === "delete" + item.productId
										}
										onClick={() =>
											handleRemoveItem(
												item.productId,
												item.quantity,
												"delete" + item.productId
											)
										}
										color="error"
									>
										<Delete />
									</LoadingButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Grid container>
				<Grid item xs={5} />
				<Grid item xs={5.22}>
					<BasketSummary />
					<Button
						component={Link}
						to="/checkout"
						size="large"
						variant="contained"
						fullWidth={true}
					>
						Checkout
					</Button>
				</Grid>
				<Grid item xs={1.78} />
			</Grid>
		</>
	);
}

/*	
----- V1 -----

const [loading, setLoading] = useState(true);
	const [basket, setBasket] = useState<Basket | null>(null);

	useEffect(() => {
		agent.Basket.get()
			.then((basket) => setBasket(basket))
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <LoadingComponent message="Loading basket..." />;
*/