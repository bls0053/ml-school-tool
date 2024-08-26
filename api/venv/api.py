from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pandas as pd
from IPython.display import display
from sklearn.discriminant_analysis import StandardScaler
from sklearn.preprocessing import MinMaxScaler, normalize
import tqdm

from Predictor import FeaturePredictor
import models


app = Flask(__name__)
CORS(app)



@app.route('/api/init_data', methods=['GET'])
def init_data():
    global df 
    global df_sub

    df = pd.read_csv('AL_Dist.csv')
    df_sub = pd.read_csv('AL_Dist.csv')

    drop_cols = [
        'leaid', 
        'achv', 
        'Locale3', 
        'math', 
        'rla'
    ]

    df_sub.drop(columns=drop_cols, inplace=True)

    
    for column in df_sub.columns:
        if df_sub[column].astype(str).str.contains(r'[0-9.-]', regex=True).any():
            pass
        else:
            df_sub.drop(columns=column, inplace=True)

    for column in df_sub.columns:
        if df_sub[column].isnull().any():
            mean = df_sub[column].mean()
            df_sub[column].fillna(mean, inplace=True)
 
    for column in df_sub.columns:
        if df_sub[column].dtype == 'object':
            df_sub[column] = pd.to_numeric(df_sub[column], errors='coerce')

    s = "okay"
    return jsonify(s)


@app.route('/api/get_data', methods=['GET'])
def get_data():

    start = int(request.args.get('start'))
    rows = int(request.args.get('limit'))

    data_slice = df.iloc[start:start + rows]
    placeholder = ""
    data_slice = data_slice.where(pd.notna(data_slice), placeholder )
    data_json = data_slice.to_dict(orient='records')
    
    return jsonify(data_json)


@app.route('/api/get_length', methods=['GET'])
def get_length():
    return jsonify(len(df))


@app.route('/api/lasso', methods=['GET'])
def lasso():
    
    

    global df_sub_coef
    df_sub_t, df_sub_coef = models.lasso_cv(df_sub, "none", "none")
    
    response = {
        'metrics' : df_sub_coef.to_dict(orient='records'),
        'coefficients' : df_sub_coef.to_dict(orient='index')
    }

    return jsonify(response)


@app.route("/api/run_predictor", methods=['GET'])
def run_predictor():

    global pred
    global mod_x_row
    global pred_results
    global x
    global first_df

    school = 7
    target = 1
    # reg = arr[2]
    allErr = .005
    ee = 100
    lock_feat = []

    # if (reg.isin(new_models)): # IMPLEMENT LAZYPREDICT
    #     mod = reg
    # else:
    #     mod = models.ext_trees(df)
    
    mod = models.ext_trees(df_sub)
    pred = FeaturePredictor(regressor=mod, target=target)

    # Initializes starting feature weights / value to be changed
    x = df_sub.drop('achvz', axis=1)
    pred.init_weights(df_sub_coef, x, lock_feat)
    pred.allowed_error = allErr
    pred.early_exit = ee
    pred_row = df_sub.loc[[school]]    
    pred.curr_val = pred_row.loc[pred_row.index[0]]['achvz']
    
    # Original row
    x_row = pred_row.drop('achvz', axis=1)

    # Modified row
    mod_x_row = x_row.copy()

    # Storage
    pred_results = x_row.copy()
    pred_results = pred_results.rename(index={0: '0'})

    predictions = pred_results
    scaler = StandardScaler()
    scaler.fit(x)
    first_df = pd.DataFrame(scaler.transform(mod_x_row), columns=x.columns)

    data = {
        'pred': pred.curr_val,
        'index': pred.curr_count,
        'df': first_df.to_dict(orient='list')
    }  


    return jsonify(data)


@app.route("/api/fetch_pred", methods=['GET'])
def fetch_pred():

    global pred
    global mod_x_row
    global pred_results

    all = []
    num_iterations = 100
    

    if((pred.match() == False) and (pred.curr_count < pred.early_exit)):

        # Set pol and stretch features
        mod_x_row = pred.stretch_feat(mod_x_row)

        pred_results = pred_results._append(mod_x_row, ignore_index=True)
        pred_results = pred_results.rename(index={pred.curr_count: pred.curr_count})

        mean_predictions = pred.regressor.predict(mod_x_row)

        # Set new achvz progress
        pred.curr_val = float(mean_predictions)
        pred.set_pol()
        
        # Iterate early exit count
        pred.curr_count += 1        

        predictions = pred_results

        scaler = StandardScaler()
        scaler.fit(x)
        new_df = pd.DataFrame(scaler.transform(mod_x_row), columns=x.columns)
        first_df.loc[1] = new_df.iloc[0]
        final_df = first_df

        data = {
            'pred': pred.curr_val,
            'index': pred.curr_count,
            'df': final_df.to_dict(orient='list')
        } 
     
        return jsonify(data)
    
    else: 
        
        print(pred_results)
        return 0
    





if __name__ == '__main__':
    app.run(debug=True)



