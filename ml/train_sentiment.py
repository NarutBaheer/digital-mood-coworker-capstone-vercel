# Simple script to train a sentiment model (positive/negative) on the provided CSV.
# Produces model.joblib that can be used later.
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import joblib

df = pd.read_csv('../dataset/mood_dataset.csv')
# dataset has 'text' and 'label' columns where label is 1 for positive, 0 for negative
X = df['text'].fillna('')
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=42)

pipe = make_pipeline(TfidfVectorizer(max_features=5000), LogisticRegression(max_iter=1000))
pipe.fit(X_train, y_train)
print('Train score:', pipe.score(X_train, y_train))
print('Test score:', pipe.score(X_test, y_test))

joblib.dump(pipe, 'model.joblib')
print('Saved model.joblib')
