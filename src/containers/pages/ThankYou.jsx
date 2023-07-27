import { useEffect } from 'react';
import { connect } from 'react-redux'
import QueryString from 'query-string';
import { useLocation } from 'react-router-dom';

import Layout from "../../components/hocs/Layout";

import { reset } from '../../redux/actions/payment';


const ThankYou = ({
    isAuthenticated,
    reset
}) => {

    useEffect(() => {
        reset()
    }, [reset])

    const location = useLocation();

    useEffect(() => {
		// Check to see if this is a redirect back from Checkout
		// const query = new URLSearchParams(window.location.search);
		const values = QueryString.parse(location.search);
    
        
		if (values.success) {
			console.log(
				'Order placed! You will receive an email confirmation.'
			);
		}

		if (values.canceled) {
			console.log(
				"Order canceled -- continue to shop around and checkout when you're ready."
			);
		}
	}, [location]);

    // if(!isAuthenticated)
    //     return <Navigate to='/' />;

    return(
        <Layout>
            <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Thank You!
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                    Hope you enjoyed shopping in Break
                </p>
                </div>
            </div>
            </div>
        </Layout>
    )
}
const mapStateToProps =state => ({
    isAuthenticated: state.Auth.isAuthenticated
})

export default connect(mapStateToProps,{
    reset
}) (ThankYou)