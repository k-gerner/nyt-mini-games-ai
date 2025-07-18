To run:

Before running, 
```
source path/to/new/venv/bin/activate
pip install -r requirements.txt
```

In `/frontend` run `npm start`
In `/backend` run `uvicorn main:app --reload --port 5001 --log-level debug`

After installing new deps, run `pip freeze > requirements.txt`