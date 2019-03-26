import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query, Mutation } from "react-apollo";
import "./styles.css";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:1337/graphql"
});
const GET_SUPPLIERS = gql`
  query {
    suppliers {
      contactName
      contactTitle
    }
  }
`;
const SuppliersList = () => (
  <Query query={GET_SUPPLIERS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return data.suppliers.map(({ contactName, contactTitle }) => (
        <div key={contactName}>
          {contactName}:{contactTitle}
        </div>
      ));
    }}
  </Query>
);
const ADD_SUPPLIER = gql`
  mutation($companyName: String, $contactName: String, $contactTitle: String) {
    createSuppliers(
      input: {
        data: {
          companyName: $companyName
          contactName: $contactName
          contactTitle: $contactTitle
        }
      }
    ) {
      supplier {
        companyName
        contactName
        contactTitle
      }
    }
  }
`;
const AddSupplier = () => {
  let inputCompanyName;
  let inputContactName;
  let inputContactTitle;
  return (
    <Mutation mutation={ADD_SUPPLIER}>
      {createSuppliers => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              createSuppliers({
                variables: {
                  companyName: inputCompanyName.value,
                  contactName: inputContactName.value,
                  contactTitle: inputContactTitle.value
                }
              });
              inputCompanyName.value = "";
              inputContactName.value = "";
              inputContactTitle.value = "";
            }}
          >
            <div>
              Company Name :
              <input
                ref={node => {
                  inputCompanyName = node;
                }}
              />
            </div>
            <div>
              Contact Name :
              <input
                ref={node => {
                  inputContactName = node;
                }}
              />
            </div>
            <div>
              Contact Title
              <input
                ref={node => {
                  inputContactTitle = node;
                }}
              />
            </div>
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};
const App = () => (
  <ApolloProvider client={client}>
    <div>
      <AddSupplier />
      <SuppliersList />
    </div>
  </ApolloProvider>
);
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
