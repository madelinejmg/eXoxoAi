import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import KFold
from sklearn.preprocessing import StandardScaler

# Load data
KOI_data = "cumulativeKOIdata_with_mass.csv"
KOI_targets = pd.read_csv(KOI_data)

# Map dispositions to numeric labels
disposition_map = {'CONFIRMED': 1, 'CANDIDATE': -1, 'FALSE POSITIVE': 0}
KOI_targets['koi_disposition_label'] = KOI_targets['koi_disposition'].map(disposition_map)

# Add log period column (safe for zeros)
KOI_targets['log_koi_period'] = np.where(
    KOI_targets['koi_period'] > 0,
    np.log(KOI_targets['koi_period']),
    np.nan
)

# Initialize predicted_label column
KOI_targets['predicted_label'] = np.nan

# Filter labeled rows
KOI_targets_filtered = KOI_targets[KOI_targets['koi_disposition_label'] >= 0].copy()
features = ['koi_fpflag_nt', 'log_koi_period', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec']

X = KOI_targets_filtered[features]
y = KOI_targets_filtered['koi_disposition_label']

# Prepare out-of-fold predictions
y_oof = np.empty(len(X))
y_oof[:] = np.nan

# 5-fold cross-validation
kf = KFold(n_splits=5, shuffle=True, random_state=42)
for train_idx, val_idx in kf.split(X):
    X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_train = y.iloc[train_idx]

    # Scale
    sc = StandardScaler()
    X_train_scaled = sc.fit_transform(X_train)
    X_val_scaled = sc.transform(X_val)

    # Train RF
    rf = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42)
    rf.fit(X_train_scaled, y_train)

    # Predict on validation fold
    y_oof[val_idx] = rf.predict(X_val_scaled)

# Assign cross-validated predictions
KOI_targets.loc[KOI_targets_filtered.index, 'predicted_label'] = y_oof.astype(int)

# Predict unlabeled rows with a final model trained on all labeled rows
KOI_targets_notclassified = KOI_targets[KOI_targets['koi_disposition_label'] == -1].copy()
X_all_labeled_scaled = sc.fit_transform(X)  # fit scaler on all labeled data
rf.fit(X_all_labeled_scaled, y)

X_unlabeled = KOI_targets_notclassified[features]
X_unlabeled_scaled = sc.transform(X_unlabeled)
y_unlabeled_pred = rf.predict(X_unlabeled_scaled)

KOI_targets.loc[KOI_targets_notclassified.index, 'predicted_label'] = y_unlabeled_pred.astype(int)

# Optional: cross-tab of actual vs predicted
ct_normalized = pd.crosstab(
    KOI_targets['koi_disposition_label'],
    KOI_targets['predicted_label'],
    normalize='index'  # each row sums to 1
)
print(ct_normalized * 100)  # multiply by 100 for percentages

#Save updated CSV
KOI_targets.to_csv("cumulativeKOIdata_with_mass_and_predictions.csv", index=False)
