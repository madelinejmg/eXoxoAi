import pandas as pd
import os
from scipy.interpolate import interp1d
import matplotlib.pyplot as plt
import numpy as np

def read_csv_to_dataframe(file_path):
    df = pd.read_csv(file_path)
    return df

def calculate_pmass(row):
    # Use 'koi_prad' if it exists, otherwise use 'pl_rade'
    radius = row.get('koi_prad', row.get('pl_rade', None))
    if radius is None:
        return None
    if radius < 12.1:
        return interpolate_mass_from_radius(radius)
    else:
        return interpolate_mass_from_radius(12.1)
    
def classify_planet(radius, mass):
        if radius > 8.1:
            return 'Gas Giant'
        elif mass > 4.4:
            return 'Neptune-Like'
        elif 2.04 < mass <= 4.4:
            return 'Super Earth'
        else:
            return 'Terrestrial'

folder_path = './'  # Replace with your actual folder path
csv_files = ['cumulativeKOIdata.csv', 'cumulativeTOIdata.csv', 'mass_radius_relationship.csv']

dataframes = []
for csv_file in csv_files:
    print(f"Reading {csv_file}...")
    file_path = os.path.join(folder_path, csv_file)
    df = read_csv_to_dataframe(file_path)
    dataframes.append(df)

# Interpolation function for mass_radius_relationship
mass_radius_df = dataframes[2]
mass = mass_radius_df.iloc[:, 0].values  # First column (mass axis)
radius = mass_radius_df.iloc[:, 1].values  # Second column (radius axis)
interpolate_mass_from_radius = interp1d(radius, mass, bounds_error=False, fill_value="extrapolate")
for i in range(2):
    dataframes[i]['calc_pmass'] = dataframes[i].apply(calculate_pmass, axis=1)
for i in range(2):
    # Get radius from 'koi_prad' if exists, else 'pl_rade'
    radius_col = 'koi_prad' if 'koi_prad' in dataframes[i].columns else 'pl_rade'
    dataframes[i]['planet_class'] = dataframes[i].apply(
        lambda row: classify_planet(row[radius_col], row['calc_pmass']), axis=1
    )
bins = np.logspace(np.log10(dataframes[0]['koi_prad'].dropna().min()), 
np.log10(dataframes[0]['koi_prad'].dropna().max()), 70)
planet_classes = dataframes[0]['planet_class'].unique()
colors = plt.cm.tab10.colors  # Use tab10 colormap for up to 10 classes
plt.figure(figsize=(8, 6))
for idx, planet_class in enumerate(planet_classes):
    mask = dataframes[0]['planet_class'] == planet_class
    plt.hist(
    dataframes[0].loc[mask, 'koi_prad'].dropna(),
    bins=bins,
    alpha=0.7,
    color=colors[idx % len(colors)],
    label=planet_class
    )
plt.xlabel('koi_prad (Planet Radius)')
plt.ylabel('Count')
plt.title('koi_prad Distribution by Planet Class (KOI Data)')
plt.xscale('log')
plt.yscale('log')
plt.grid(True)
plt.legend()
plt.show()
#plt.figure(figsize=(8, 6))
#plt.hist(dataframes[0]['koi_prad'].dropna(), bins=bins, alpha=0.7, color='skyblue')
#plt.xlabel('koi_prad (Planet Radius)')
#plt.ylabel('Count')
#plt.title('Distribution of koi_prad in KOI Data')
#plt.xscale('log')
#plt.yscale('log')
#plt.grid(True)
#plt.show()
print(dataframes[0]['koi_prad'].dropna().min(), dataframes[0]['koi_prad'].dropna().max())
print(dataframes[0]['calc_pmass'].dropna().min(), dataframes[0]['calc_pmass'].dropna().max())

print(dataframes[0][dataframes[0]['koi_prad'] > 8.13][['koi_prad', 'calc_pmass']])

# Save updated dataframes with 'calc_pmass' and 'planet_class' columns
output_files = ['cumulativeKOIdata_with_mass.csv', 'cumulativeTOIdata_with_mass.csv']
for i in range(2):
    dataframes[i].to_csv(output_files[i], index=False)
print(f"Saved updated CSVs: {output_files}")
#mbins = np.logspace(np.log10(dataframes[0]['calc_pmass'].dropna().min()), 
#        np.log10(dataframes[0]['calc_pmass'].dropna().max()), 70)
#plt.figure(figsize=(8, 6))
#plt.hist(dataframes[0]['calc_pmass'].dropna(), bins=mbins, alpha=0.7, color='skyblue')
#plt.xlabel('calc_pmass (Planet Mass)')
#plt.ylabel('Count')
#plt.title('Distribution of calc_pmass in KOI Data')
#plt.xscale('log')
#plt.yscale('log')
#plt.grid(True)
#plt.show()

#plt.figure(figsize=(8, 6))
#plt.scatter(dataframes[0]['calc_pmass'], dataframes[0]['koi_prad'], alpha=0.6)
#plt.ylabel('koi_prad (Planet Radius)')
#plt.xlabel('calc_pmass (Calculated Planet Mass)')
#plt.title('Calculated Planet Mass vs Planet Radius (KOI Data)')
#plt.grid(True)
#plt.show()

for idx, df in enumerate(dataframes[:2]):
    print(f"Classification counts for dataframe {idx}:")
    print(df['planet_class'].value_counts())
    print()