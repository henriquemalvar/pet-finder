import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface ContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function Container({ children, style }: ContainerProps) {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});